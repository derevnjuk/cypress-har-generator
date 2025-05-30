declare module 'chrome-remote-interface' {
  import type ProtocolProxyApi from 'devtools-protocol/types/protocol-proxy-api';
  import type ProtocolMappingApi from 'devtools-protocol/types/protocol-mapping';
  import { EventEmitter } from 'node:events';

  declare namespace CDP {
    interface BaseOptions {
      host?: string | undefined;
      port?: number | undefined;
      secure?: boolean | undefined;
      useHostName?: boolean | undefined;
      alterPath?: ((path: string) => string) | undefined;
    }

    interface Options extends BaseOptions {
      target?:
        | ((targets: Target[]) => Target | number)
        | Target
        | string
        | undefined;
      protocol?: Protocol | undefined;
      local?: boolean | undefined;
    }

    interface ActivateOptions extends BaseOptions {
      id: string;
    }

    interface CloseOptions extends BaseOptions {
      id: string;
    }

    interface NewOptions extends BaseOptions {
      url?: string | undefined;
    }

    interface ProtocolOptions extends BaseOptions {
      local?: boolean | undefined;
    }

    interface EventMessage {
      method: string;
      params: object;
      sessionId?: string | undefined;
    }

    interface SendError {
      code: number;
      message: string;
      data?: string | undefined;
    }

    interface SendCallback<T extends keyof ProtocolMappingApi.Commands> {
      (error: true, response: SendError): void;
      (
        error: false,
        response: ProtocolMappingApi.Commands[T]['returnType']
      ): void;
      (error: Error, response: undefined): void;
    }

    interface Target {
      description: string;
      devtoolsFrontendUrl: string;
      id: string;
      title: string;
      type: string;
      url: string;
      webSocketDebuggerUrl: string;
    }

    interface VersionResult {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Browser': string;
      'Protocol-Version': string;
      'User-Agent': string;
      'V8-Version': string;
      'Webkit-Version': string;
      'webSocketDebuggerUrl': string;
      /* eslint-enable @typescript-eslint/naming-convention */
    }

    /////////////////////////////////////////////////
    // Generated with https://app.quicktype.io/, Name: Protocol, Language: TypeScript, Interfaces only.
    // Manually done: TypeEnum simplified, add " | undefined" for optional properties.
    // Source: https://github.com/ChromeDevTools/devtools-protocol/blob/master/json/ (merge JSON objects)
    /////////////////////////////////////////////////
    interface Protocol {
      version: Version;
      domains: Domain[];
    }

    interface Domain {
      domain: string;
      experimental?: boolean | undefined;
      dependencies?: string[] | undefined;
      types?: TypeElement[] | undefined;
      commands: Command[];
      events?: Event[] | undefined;
      description?: string | undefined;
      deprecated?: boolean | undefined;
    }

    interface Command {
      name: string;
      description?: string | undefined;
      experimental?: boolean | undefined;
      parameters?: Parameter[] | undefined;
      returns?: Parameter[] | undefined;
      redirect?: string | undefined;
      deprecated?: boolean | undefined;
    }

    interface Parameter {
      name: string;
      description?: string | undefined;
      optional?: boolean | undefined;
      $ref?: string | undefined;
      type?: TypeEnum | undefined;
      items?: Items | undefined;
      enum?: string[] | undefined;
      experimental?: boolean | undefined;
      deprecated?: boolean | undefined;
    }

    interface Items {
      type?: TypeEnum | undefined;
      $ref?: string | undefined;
    }

    type TypeEnum =
      | 'any'
      | 'array'
      | 'boolean'
      | 'integer'
      | 'number'
      | 'object'
      | 'string';

    interface Event {
      name: string;
      description?: string | undefined;
      parameters?: Parameter[] | undefined;
      experimental?: boolean | undefined;
      deprecated?: boolean | undefined;
    }

    interface TypeElement {
      id: string;
      description?: string | undefined;
      type: TypeEnum;
      enum?: string[] | undefined;
      properties?: Parameter[] | undefined;
      experimental?: boolean | undefined;
      items?: Items | undefined;
      deprecated?: boolean | undefined;
    }

    interface Version {
      major: string;
      minor: string;
    }
    /////////////////////////////////////////////////
    // Generated content end.
    /////////////////////////////////////////////////

    type GetEventFromString<
      D extends string,
      S extends string
    > = S extends `${D}.${infer E}` ? E : never;
    type GetEvent<D extends string> = GetEventFromString<
      D,
      keyof ProtocolMappingApi.Events
    >;
    type GetReturnType<
      D extends string,
      E extends string
    > = `${D}.${E}` extends keyof ProtocolMappingApi.Events
      ? ProtocolMappingApi.Events[`${D}.${E}`][0]
      : never;
    type DoEventPromises<D extends string> = {
      [event in GetEvent<D>]: () => Promise<
        // tslint:disable-next-line: void-return
        GetReturnType<D, event> extends undefined
          ? void
          : GetReturnType<D, event>
      >;
    };
    type DoEventListeners<D extends string> = {
      [event in GetEvent<D>]: (
        listener: (params: GetReturnType<D, event>, sessionId?: string) => void
      ) => () => Client;
    };
    type DoEventObj<D> = D extends string
      ? DoEventPromises<D> & DoEventListeners<D>
      : Record<keyof any, never>;

    type IsNullableObj<T> = Record<keyof T, undefined> extends T ? true : false;
    /**
     * Checks whether the only parameter of `T[key]` is nullable i.e. all of
     * its properties are optional, and makes it optional if so.
     */
    type OptIfParamNullable<T> = {
      [key in keyof T]: T[key] extends (params: any) => any
        ? IsNullableObj<Parameters<T[key]>[0]> extends true
          ? (params?: Parameters<T[key]>[0]) => ReturnType<T[key]>
          : T[key]
        : T[key];
    };

    type ImproveAPI<T> = {
      [key in keyof T]: DoEventObj<key> & OptIfParamNullable<T[key]>;
    };
    interface StableDomains {
      Browser: ProtocolProxyApi.BrowserApi;
      Debugger: ProtocolProxyApi.DebuggerApi;
      DOM: ProtocolProxyApi.DOMApi;
      DOMDebugger: ProtocolProxyApi.DOMDebuggerApi;
      Emulation: ProtocolProxyApi.EmulationApi;
      Input: ProtocolProxyApi.InputApi;
      IO: ProtocolProxyApi.IOApi;
      Log: ProtocolProxyApi.LogApi;
      Network: ProtocolProxyApi.NetworkApi;
      Page: ProtocolProxyApi.PageApi;
      Performance: ProtocolProxyApi.PerformanceApi;
      Profiler: ProtocolProxyApi.ProfilerApi;
      Runtime: ProtocolProxyApi.RuntimeApi;
      Security: ProtocolProxyApi.SecurityApi;
      Target: ProtocolProxyApi.TargetApi;
    }
    interface DeprecatedDomains {
      /** @deprecated This domain is deprecated - use Runtime or Log instead. */
      Console: ProtocolProxyApi.ConsoleApi;
      /** @deprecated This domain is deprecated. */
      Schema: ProtocolProxyApi.SchemaApi;
    }
    interface ExperimentalDomains {
      /** @deprecated this API is experimental. */
      Accessibility: ProtocolProxyApi.AccessibilityApi;
      /** @deprecated this API is experimental. */
      Animation: ProtocolProxyApi.AnimationApi;
      /** @deprecated this API is experimental. */
      ApplicationCache: ProtocolProxyApi.ApplicationCacheApi;
      /** @deprecated this API is experimental. */
      Audits: ProtocolProxyApi.AuditsApi;
      /** @deprecated this API is experimental. */
      BackgroundService: ProtocolProxyApi.BackgroundServiceApi;
      /** @deprecated this API is experimental. */
      CacheStorage: ProtocolProxyApi.CacheStorageApi;
      /** @deprecated this API is experimental. */
      Cast: ProtocolProxyApi.CastApi;
      /** @deprecated this API is experimental. */
      CSS: ProtocolProxyApi.CSSApi;
      /** @deprecated this API is experimental. */
      Database: ProtocolProxyApi.DatabaseApi;
      /** @deprecated this API is experimental. */
      DeviceOrientation: ProtocolProxyApi.DeviceOrientationApi;
      /** @deprecated this API is experimental. */
      DOMSnapshot: ProtocolProxyApi.DOMSnapshotApi;
      /** @deprecated this API is experimental. */
      DOMStorage: ProtocolProxyApi.DOMStorageApi;
      /** @deprecated this API is experimental. */
      Fetch: ProtocolProxyApi.FetchApi;
      /** @deprecated this API is experimental. */
      HeadlessExperimental: ProtocolProxyApi.HeadlessExperimentalApi;
      /** @deprecated this API is experimental. */
      HeapProfiler: ProtocolProxyApi.HeapProfilerApi;
      /** @deprecated this API is experimental. */
      IndexedDB: ProtocolProxyApi.IndexedDBApi;
      /** @deprecated this API is experimental. */
      Inspector: ProtocolProxyApi.InspectorApi;
      /** @deprecated this API is experimental. */
      LayerTree: ProtocolProxyApi.LayerTreeApi;
      /** @deprecated this API is experimental. */
      Media: ProtocolProxyApi.MediaApi;
      /** @deprecated this API is experimental. */
      Memory: ProtocolProxyApi.MemoryApi;
      /** @deprecated this API is experimental. */
      Overlay: ProtocolProxyApi.OverlayApi;
      /** @deprecated this API is experimental. */
      ServiceWorker: ProtocolProxyApi.ServiceWorkerApi;
      /** @deprecated this API is experimental. */
      Storage: ProtocolProxyApi.StorageApi;
      /** @deprecated this API is experimental. */
      SystemInfo: ProtocolProxyApi.SystemInfoApi;
      /** @deprecated this API is experimental. */
      Tethering: ProtocolProxyApi.TetheringApi;
      /** @deprecated this API is experimental. */
      Tracing: ProtocolProxyApi.TracingApi;
      /** @deprecated this API is experimental. */
      WebAudio: ProtocolProxyApi.WebAudioApi;
      /** @deprecated this API is experimental. */
      WebAuthn: ProtocolProxyApi.WebAuthnApi;
    }
    type AllDomains = StableDomains & DeprecatedDomains & ExperimentalDomains;
    interface Client
      extends EventEmitter,
        EventPromises<ProtocolMappingApi.Events>,
        EventCallbacks<ProtocolMappingApi.Events>,
        ImproveAPI<AllDomains> {
      close(): Promise<void>;
      on(event: 'event', callback: (message: EventMessage) => void): void;
      on(event: 'ready' | 'disconnect', callback: () => void): void;
      // '<domain>.<method>' i.e. Network.requestWillBeSent
      on<T extends keyof ProtocolMappingApi.Events>(
        event: T,
        callback: (
          params: ProtocolMappingApi.Events[T][0],
          sessionId?: string
        ) => void
      ): void;
      // '<domain>.<method>.<sessionId>' i.e. Network.requestWillBeSent.abc123
      on(
        event: string,
        callback: (params: unknown, sessionId?: string) => void
      ): void;
      // client.send(method, [params], [sessionId], [callback])
      send<T extends keyof ProtocolMappingApi.Commands>(
        event: T,
        callback: SendCallback<T>
      ): void;
      send<T extends keyof ProtocolMappingApi.Commands>(
        event: T,
        params: ProtocolMappingApi.Commands[T]['paramsType'][0],
        callback: SendCallback<T>
      ): void;
      send<T extends keyof ProtocolMappingApi.Commands>(
        event: T,
        params: ProtocolMappingApi.Commands[T]['paramsType'][0],
        sessionId: string,
        callback: SendCallback<T>
      ): void;
      send<T extends keyof ProtocolMappingApi.Commands>(
        event: T,
        params?: ProtocolMappingApi.Commands[T]['paramsType'][0],
        sessionId?: string
      ): Promise<ProtocolMappingApi.Commands[T]['returnType']>;
    }

    // '<domain>.<event>' i.e. Page.loadEventFired
    type EventPromises<T extends ProtocolMappingApi.Events> = {
      [Property in keyof T]: () => T[Property] extends [any]
        ? Promise<T[Property][0]>
        : Promise<void>;
    };

    type EventCallbacks<T extends ProtocolMappingApi.Events> = {
      [Property in keyof T]: (
        callback: (
          params: T[Property] extends [any] ? T[Property][0] : undefined,
          sessionId?: string
        ) => void
      ) => () => Client;
    };
  }

  declare const CDP: {
    (options: CDP.Options, callback: (client: CDP.Client) => void): void;
    (callback: (client: CDP.Client) => void): void;
    (options?: CDP.Options): Promise<CDP.Client>;

    /* eslint-disable @typescript-eslint/naming-convention */
    Activate(
      options: CDP.ActivateOptions,
      callback: (err: Error | null) => void
    ): void;
    Activate(options: CDP.ActivateOptions): Promise<void>;

    Close(
      options: CDP.CloseOptions,
      callback: (err: Error | null) => void
    ): void;
    Close(options: CDP.CloseOptions): Promise<void>;

    List(
      options: CDP.BaseOptions,
      callback: (err: Error | null, targets: CDP.Target[]) => void
    ): void;
    List(callback: (err: Error | null, targets: CDP.Target[]) => void): void;
    List(options?: CDP.BaseOptions): Promise<CDP.Target[]>;

    New(
      options: CDP.NewOptions,
      callback: (err: Error | null, target: CDP.Target) => void
    ): void;
    New(callback: (err: Error | null, target: CDP.Target) => void): void;
    New(options?: CDP.NewOptions): Promise<CDP.Target>;

    Protocol(
      options: CDP.ProtocolOptions,
      callback: (err: Error | null, protocol: CDP.Protocol) => void
    ): void;
    Protocol(
      callback: (err: Error | null, protocol: CDP.Protocol) => void
    ): void;
    Protocol(options?: CDP.ProtocolOptions): Promise<CDP.Protocol>;

    Version(
      options: CDP.BaseOptions,
      callback: (err: Error | null, info: CDP.VersionResult) => void
    ): void;
    Version(
      callback: (err: Error | null, info: CDP.VersionResult) => void
    ): void;
    Version(options?: CDP.BaseOptions): Promise<CDP.VersionResult>;
    /* eslint-enable @typescript-eslint/naming-convention */
  };

  export = CDP;
}
