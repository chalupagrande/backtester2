export class Strategy {
  public name: string;
  public description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  public async execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}