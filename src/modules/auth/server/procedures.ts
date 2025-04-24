import { headers as getHeaders, cookies as getCookies } from "next/headers";

import { TRPCError } from "@trpc/server";
import { AUTH_COOKIES } from "../constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { loginSchema, registerSchema } from "@/modules/auth/schema";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });
    return session;
  }),

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIES);
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, username, password } = input;
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: username,
          },
        },
      });
      const existingUser = existingData.docs[0];
      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already taken",
        });
      }
      await ctx.db.create({
        collection: "users",
        data: {
          email: email,
          username: username,
          password: password, // this will be hashed
        },
      });

      const data = await ctx.db.login({
        collection: "users",
        data: {
          email: email,
          password: password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to login",
        });
      }

      const cookies = await getCookies();
      cookies.set({
        name: AUTH_COOKIES,
        value: data.token,
        httpOnly: true,
        path: "/",
        //TODO: Ensure cross domain cookie sharing
        // sameSite: "none",
        // domain: ""
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;

    const data = await ctx.db.login({
      collection: "users",
      data: {
        email: email,
        password: password,
      },
    });
    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to login",
      });
    }

    const cookies = await getCookies();
    cookies.set({
      name: AUTH_COOKIES,
      value: data.token,
      httpOnly: true,
      path: "/",
      //TODO: Ensure cross domain cookie sharing
      // sameSite: "none",
      // domain: ""
    });
    return data;
  }),
});
