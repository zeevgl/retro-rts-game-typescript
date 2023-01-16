import { Player } from "./player";

export class Resources {
  private money: number = 0;
  private increaseAmount: number = 0;
  private rate: number = 1;
  private increaseBy: number = 12;
  private tick: number = 0;
  constructor(private player: Player) {}

  update(deltaTime, timestamp) {
    if (this.increaseAmount !== 0) {
      this.tick += deltaTime;
      if (this.tick >= this.rate) {
        this.tick = 0;

        const sign = Math.abs(this.increaseAmount) / this.increaseAmount;
        const abs = Math.abs(this.increaseAmount - sign * this.increaseBy);
        if (abs >= this.increaseBy) {
          this.money += sign * this.increaseBy;
          this.increaseAmount -= sign * this.increaseBy;
        } else {
          this.money += this.increaseAmount;
          this.increaseAmount = 0;
        }
      }
    }
  }

  addResources(amount: number) {
    this.increaseAmount += Math.round(amount);
  }

  deductResources(amount: number) {
    this.increaseAmount -= Math.round(amount);
  }

  canAfford(cost: number) {
    return this.money >= cost;
  }
}
