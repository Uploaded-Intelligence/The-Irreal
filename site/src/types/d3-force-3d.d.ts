declare module 'd3-force-3d' {
  export function forceSimulation<NodeDatum>(
    nodes?: NodeDatum[],
    numDimensions?: number
  ): Simulation<NodeDatum>;

  export function forceManyBody<NodeDatum>(): ForceManyBody<NodeDatum>;
  export function forceLink<NodeDatum, LinkDatum>(
    links?: LinkDatum[]
  ): ForceLink<NodeDatum, LinkDatum>;
  export function forceCenter<NodeDatum>(
    x?: number,
    y?: number,
    z?: number
  ): ForceCenter<NodeDatum>;

  interface Simulation<NodeDatum> {
    force(name: string, force?: any): this;
    tick(iterations?: number): this;
    stop(): this;
    nodes(): NodeDatum[];
  }

  interface ForceManyBody<NodeDatum> {
    strength(value: number | ((d: NodeDatum) => number)): this;
  }

  interface ForceLink<NodeDatum, LinkDatum> {
    id(accessor: (d: NodeDatum) => string): this;
    distance(value: number | ((d: LinkDatum) => number)): this;
    links(): LinkDatum[];
  }

  interface ForceCenter<NodeDatum> {
    x(value: number): this;
    y(value: number): this;
    z(value: number): this;
  }
}
