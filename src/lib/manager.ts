import type { Adapter } from "next-auth/adapters";
import { ofetch, type FetchOptions } from "ofetch";

import { mergeJSON } from "./json";

type ProcedureConfig = {
  path: string;
  select?: (res: any) => any;
} & FetchOptions;

type NoOptionalAdapter = Required<Adapter>;
type AdapterArg_0<T extends keyof NoOptionalAdapter> = Parameters<
  NoOptionalAdapter[T]
>[0];

type DefaultAdapterProcedures = {
  createUser: (user: AdapterArg_0<"createUser">) => ProcedureConfig;
  getUserById: (id: AdapterArg_0<"getUser">) => ProcedureConfig;
  getUserByEmail: (email: AdapterArg_0<"getUserByEmail">) => ProcedureConfig;
  getUserByAccount: (
    account: AdapterArg_0<"getUserByAccount">
  ) => ProcedureConfig;
  updateUser: (user: AdapterArg_0<"updateUser">) => ProcedureConfig;
  linkAccount: (account: AdapterArg_0<"linkAccount">) => ProcedureConfig;
  deleteUser?: (id: AdapterArg_0<"deleteUser">) => ProcedureConfig;
  unlinkAccount?: (account: AdapterArg_0<"unlinkAccount">) => ProcedureConfig;
  createSession: (session: AdapterArg_0<"createSession">) => ProcedureConfig;
  getSessionAndUser: (
    sessionToken: AdapterArg_0<"getSessionAndUser">
  ) => ProcedureConfig;
  updateSession: (session: AdapterArg_0<"updateSession">) => ProcedureConfig;
  deleteSession: (
    sessionToken: AdapterArg_0<"deleteSession">
  ) => ProcedureConfig;
  createVerificationToken?: (
    verificationToken: AdapterArg_0<"createVerificationToken">
  ) => ProcedureConfig;
  useVerificationToken?: (
    params: AdapterArg_0<"useVerificationToken">
  ) => ProcedureConfig;
};

type AdapterProcedures<WithVerificationToken = boolean> =
  DefaultAdapterProcedures &
    (WithVerificationToken extends true
      ? {
          createVerificationToken: (
            verificationToken: AdapterArg_0<"createVerificationToken">
          ) => ProcedureConfig;
          useVerificationToken: (
            params: AdapterArg_0<"useVerificationToken">
          ) => ProcedureConfig;
        }
      : {});

export type AdapterManagerConfig<WithVerificationToken = boolean> = {
  adapterProcedures: AdapterProcedures<WithVerificationToken>;
} & FetchOptions;

const mergeFetchOptions = mergeJSON<FetchOptions>;
const defaultSerializer = (data: any) => data;

export class HttpAdpaterManager<WithVerificationToken = boolean> {
  public constructor(
    private defaultFetchOptions: AdapterManagerConfig<WithVerificationToken>
  ) {}

  public async createUser(user: AdapterArg_0<"createUser">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.createUser(user);

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async getUserById(id: AdapterArg_0<"getUser">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.getUserById(id);

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async getUserByEmail(email: AdapterArg_0<"getUserByEmail">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.getUserByEmail(email);

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async getUserByAccount(
    providerAccountId: AdapterArg_0<"getUserByAccount">
  ) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.getUserByAccount(
      providerAccountId
    );

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async deleteUser(providerAccountId: AdapterArg_0<"deleteUser">) {
    if (!this.defaultFetchOptions.adapterProcedures.deleteUser) {
      throw new Error("deleteUser is not defined in procedures");
    }

    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.deleteUser(
      providerAccountId
    );

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async linkAccount(account: AdapterArg_0<"linkAccount">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.linkAccount(account);

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async unlinkAccount(providerAccountId: AdapterArg_0<"unlinkAccount">) {
    if (!this.defaultFetchOptions.adapterProcedures.unlinkAccount) {
      throw new Error("unlinkAccount is not defined in procedures");
    }

    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.unlinkAccount(
      providerAccountId
    );

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async createSession(account: AdapterArg_0<"createSession">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.createSession(account);

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async getSessionAndUser(account: AdapterArg_0<"getSessionAndUser">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.getSessionAndUser(account);

    const res = ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async updateSession(account: AdapterArg_0<"updateSession">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.updateSession(account);

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async deleteSession(account: AdapterArg_0<"deleteSession">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.deleteSession(account);

    const res = ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async createVerificationToken(
    providerAccountId: AdapterArg_0<"createVerificationToken">
  ) {
    if (!this.defaultFetchOptions.adapterProcedures.createVerificationToken) {
      throw new Error("createVerificationToken is not defined in procedures");
    }

    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.createVerificationToken(
      providerAccountId
    );

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async useVerificationToken(
    providerAccountId: AdapterArg_0<"useVerificationToken">
  ) {
    if (!this.defaultFetchOptions.adapterProcedures.useVerificationToken) {
      throw new Error("useVerificationToken is not defined in procedures");
    }

    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.useVerificationToken(
      providerAccountId
    );

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }

  public async updateUser(user: AdapterArg_0<"updateUser">) {
    const {
      path,
      select: serialize = defaultSerializer,
      ...fetchOptions
    } = this.defaultFetchOptions.adapterProcedures.updateUser(user);

    const res = await ofetch(
      path,
      mergeFetchOptions(fetchOptions, this.defaultFetchOptions)
    );

    return serialize(res);
  }
}
