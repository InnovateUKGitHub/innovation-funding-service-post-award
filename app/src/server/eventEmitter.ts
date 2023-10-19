type EventMap = AnyObject;

class AccEvent<TMap extends EventMap, TKey extends string & keyof TMap> extends Event {
  public readonly detail: TMap[TKey];

  constructor(type: TKey, detail: TMap[TKey]) {
    super(type);
    this.detail = detail;
  }
}

class AccEventEmitter<TMap extends EventMap = EventMap> {
  target: EventTarget;

  constructor() {
    this.target = new EventTarget();
  }

  on<TKey extends string & keyof TMap>(key: TKey, callback: (data: TMap[TKey]) => void): void {
    this.target.addEventListener(key, e => {
      const event = e as AccEvent<TMap, TKey>;
      callback(event.detail);
    });
  }

  emit<TKey extends string & keyof TMap>(key: TKey, detail: TMap[TKey]): void {
    const event = new AccEvent(key, detail);
    this.target.dispatchEvent(event);
  }
}

type WebRequestEventMap = {
  chunk: string;
  done: undefined;
};

type DocumentUploadEventMap = {
  documentUploaded: string;
  done: undefined;
};

export { AccEventEmitter, WebRequestEventMap, DocumentUploadEventMap };
