import type { Adapter } from "next-auth/adapters";
import { ofetch, type FetchOptions } from "ofetch";

import { mergeJSON } from "./json";
import * as schemas from "./validation";

type ProcedureConfig<TRes = unknown> = {
  path: string;
  select?: (res: TRes) => any;
} & FetchOptions;

type NoOptionalAdapter = Required<Adapter>;
type AdapterArg_0<T extends keyof NoOptionalAdapter> = Parameters<
  NoOptionalAdapter[T]
>[0];

type DefaultAdapterProcedures = {
  createUser: <TRes = unknown>(
    user: AdapterArg_0<"createUser">
  ) => ProcedureConfig<TRes>;
  getUserById: <TRes = unknown>(
    id: AdapterArg_0<"getUser">
  ) => ProcedureConfig<TRes>;
  getUserByEmail: <TRes = unknown>(
    email: AdapterArg_0<"getUserByEmail">
  ) => ProcedureConfig<TRes>;
  getUserByAccount: <TRes = unknown>(
    account: AdapterArg_0<"getUserByAccount">
  ) => ProcedureConfig<TRes>;
  updateUser: <TRes = unknown>(
    user: AdapterArg_0<"updateUser">
  ) => ProcedureConfig<TRes>;
  linkAccount: <TRes = unknown>(
    account: AdapterArg_0<"linkAccount">
  ) => ProcedureConfig<TRes>;
  deleteUser?: <TRes = unknown>(
    id: AdapterArg_0<"deleteUser">
  ) => ProcedureConfig<TRes>;
  unlinkAccount?: <TRes = unknown>(
    account: AdapterArg_0<"unlinkAccount">
  ) => ProcedureConfig<TRes>;
  createSession: <TRes = unknown>(
    session: AdapterArg_0<"createSession">
  ) => ProcedureConfig<TRes>;
  getSessionAndUser: <TRes = unknown>(
    sessionToken: AdapterArg_0<"getSessionAndUser">
  ) => ProcedureConfig<TRes>;
  updateSession: <TRes = unknown>(
    session: AdapterArg_0<"updateSession">
  ) => ProcedureConfig<TRes>;
  deleteSession: <TRes = unknown>(
    sessionToken: AdapterArg_0<"deleteSession">
  ) => ProcedureConfig<TRes>;
  createVerificationToken?: <TRes = unknown>(
    verificationToken: AdapterArg_0<"createVerificationToken">
  ) => ProcedureConfig<TRes>;
  useVerificationToken?: <TRes = unknown>(
    params: AdapterArg_0<"useVerificationToken">
  ) => ProcedureConfig<TRes>;
};

type AdapterProcedures<WithVerificationToken = boolean> =
  DefaultAdapterProcedures &
    (WithVerificationToken extends true
      ? {
          createVerificationToken: <TRes = unknown>(
            verificationToken: AdapterArg_0<"createVerificationToken">
          ) => ProcedureConfig<TRes>;
          useVerificationToken: <TRes = unknown>(
            params: AdapterArg_0<"useVerificationToken">
          ) => ProcedureConfig<TRes>;
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
    return await schemas.createUserSchema.parseAsync(serialize(res));
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
    return await schemas.getUserSchema.parseAsync(serialize(res));
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
    return await schemas.getUserByEmailSchema.parseAsync(serialize(res));
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
    return await schemas.getUserByAccountSchema.parseAsync(serialize(res));
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
    return await schemas.deleteUserSchema.parseAsync(serialize(res));
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
    return await schemas.linkAccountSchema.parseAsync(serialize(res));
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
    return await schemas.unlinkAccountSchema.parseAsync(serialize(res));
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
    return await schemas.createSessionSchema.parseAsync(serialize(res));
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
    return await schemas.getSessionAndUserSchema.parseAsync(serialize(res));
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
    return await schemas.updateSessionSchema.parseAsync(serialize(res));
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
    return await schemas.deleteSessionSchema.parseAsync(serialize(res));
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
    return await schemas.createVerificationTokenSchema.parseAsync(
      serialize(res)
    );
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
    return await schemas.useVerificationRequestSchema.parseAsync(
      serialize(res)
    );
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
    return await schemas.updateUserSchema.parseAsync(serialize(res));
  }
}
