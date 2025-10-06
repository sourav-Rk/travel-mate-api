export interface IDBSession<SessionType = unknown>{
  start(): Promise<void>;
  end(): Promise<void>;
  getSession(): SessionType;
  withTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
