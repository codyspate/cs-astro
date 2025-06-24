type Uuid = ReturnType<typeof crypto.randomUUID>;

export class SynthNode {
  public id: Uuid;
  constructor(
    public node: AudioNode,
    public params: AudioParamMap = new AudioParamMap(),
  ) {
    this.id = crypto.randomUUID();
  }
}

export class Synthesizer {
  public id: Uuid;
  public context: AudioContext = new AudioContext();
  public nodes: SynthNode[] = [];
  public chain: { from: Uuid; to: Uuid }[] = [];
  constructor() {
    this.id = crypto.randomUUID();
  }
}
