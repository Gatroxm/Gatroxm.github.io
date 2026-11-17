import * as THREE from "three";
import { ISLAND_RADIUS, PALETTE, SPAWN } from "./constants";

export interface DriveInput {
  forward: number;
  steer: number;
  boost: boolean;
  jump: boolean;
}

/** Vehículo arcade low poly con colisiones de caja y salto simple. */
export class Vehicle {
  readonly group = new THREE.Group();
  private speed = 0;
  private yaw = Math.PI;
  private verticalSpeed = 0;
  private height = 0.85;
  private jumpHeld = false;
  private wheelMeshes: THREE.Mesh[] = [];

  constructor() {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.65, 3.1),
      new THREE.MeshStandardMaterial({ color: PALETTE.dark, roughness: 0.55, metalness: 0.35 }),
    );
    body.position.y = 0.35;
    body.castShadow = true;
    this.group.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.6, 1.4),
      new THREE.MeshStandardMaterial({
        color: PALETTE.navy,
        roughness: 0.4,
        metalness: 0.4,
        emissive: PALETTE.blue,
        emissiveIntensity: 0.18,
      }),
    );
    cabin.position.set(0, 0.92, -0.15);
    this.group.add(cabin);

    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.09, 0.12),
      new THREE.MeshBasicMaterial({ color: PALETTE.blue }),
    );
    strip.position.set(0, 0.7, 1.58);
    this.group.add(strip);

    const wheelGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 10);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.navy, roughness: 0.9 });
    for (const x of [-1.05, 1.05]) {
      for (const z of [-1.05, 1.05]) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.02, z);
        this.wheelMeshes.push(wheel);
        this.group.add(wheel);
      }
    }

    this.respawn();
  }

  get position(): THREE.Vector3 {
    return this.group.position;
  }

  respawn(): void {
    this.group.position.set(SPAWN.x, this.height, SPAWN.z);
    this.group.rotation.set(0, Math.PI, 0);
    this.yaw = Math.PI;
    this.speed = 0;
    this.verticalSpeed = 0;
    this.jumpHeld = false;
  }

  update(dt: number, input: DriveInput, obstacles: THREE.Box3[], reducedMotion: boolean): void {
    const maxSpeed = input.boost ? 23 : 13;
    const target = input.forward * maxSpeed;
    const acceleration = input.forward !== 0 ? 12 : 16;
    this.speed += (target - this.speed) * Math.min(acceleration * dt, 1);

    const turnRate = reducedMotion ? 1.3 : 1.9;
    this.yaw += input.steer * turnRate * dt * (0.35 + Math.min(Math.abs(this.speed) / 12, 0.65));
    this.group.rotation.y = this.yaw;

    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    this.group.position.addScaledVector(forward, this.speed * dt);

    if (input.jump && !this.jumpHeld && this.height <= 0.85) {
      this.verticalSpeed = reducedMotion ? 6.5 : 9.5;
    }
    this.jumpHeld = input.jump;

    this.verticalSpeed -= 24 * dt;
    this.height += this.verticalSpeed * dt;
    if (this.height <= 0.85) {
      this.height = 0.85;
      this.verticalSpeed = 0;
    }
    this.group.position.y = this.height;

    const limit = ISLAND_RADIUS - 2.2;
    const distance = Math.hypot(this.group.position.x, this.group.position.z);
    if (distance > limit) {
      const scale = limit / distance;
      this.group.position.x *= scale;
      this.group.position.z *= scale;
      this.speed *= 0.4;
    }

    const carBox = new THREE.Box3().setFromObject(this.group);
    for (const obstacle of obstacles) {
      if (!carBox.intersectsBox(obstacle)) continue;
      const dx = this.group.position.x - (obstacle.min.x + obstacle.max.x) / 2;
      const dz = this.group.position.z - (obstacle.min.z + obstacle.max.z) / 2;
      if (Math.abs(dx) > Math.abs(dz)) {
        this.group.position.x = dx > 0 ? obstacle.max.x + 1.6 : obstacle.min.x - 1.6;
      } else {
        this.group.position.z = dz > 0 ? obstacle.max.z + 1.6 : obstacle.min.z - 1.6;
      }
      this.speed *= 0.25;
      carBox.setFromObject(this.group);
    }

    const roll = reducedMotion ? 0 : THREE.MathUtils.clamp(-input.steer * 0.08 * Math.abs(this.speed) / 13, -0.08, 0.08);
    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, roll, 0.12);
    this.wheelMeshes.forEach((wheel) => {
      wheel.rotation.x += this.speed * dt * 2;
    });
  }
}
