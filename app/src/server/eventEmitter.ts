type EventMap = AnyObject;

class AccEventEmitter<TMap extends EventMap = EventMap> {
  target: EventTarget;

  constructor() {
    this.target = new EventTarget();
  }

  on<TKey extends string & keyof TMap>(key: TKey, callback: (data: TMap[TKey]) => void): void {
    this.target.addEventListener(key, e => {
      const event = e as CustomEvent<{ value: TMap[TKey] }>;
      callback(event.detail.value);
    });
  }

  emit<TKey extends string & keyof TMap>(key: TKey, detail: TMap[TKey]): void {
    const event = new CustomEvent(key, {
      detail: {
        value: detail,
      },
    });

    this.target.dispatchEvent(event);
  }
}

class DocumentUploadEventEmitter extends AccEventEmitter<{
  documentUploaded: string;
  done: undefined;
}> {}

export { AccEventEmitter, DocumentUploadEventEmitter };
