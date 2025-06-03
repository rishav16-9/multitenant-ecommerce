import { headers as getHeaders } from "next/headers";

import { TRPCError } from "@trpc/server";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { loginSchema, registerSchema } from "@/modules/auth/schema";
import { generateAuthCookies } from "../utils";
import { stripe } from "@/lib/stripe";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });
    return session;
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

      const account = await stripe.accounts.create({});

      if(!account){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stripe account was not created"
        })
      }

      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        },
      });
      await ctx.db.create({
        collection: "users",
        data: {
          email: email,
          username: username,
          password: password, // this will be hashed
          tenants: [
            {
              tenant: tenant.id,
            },
          ],
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
      await generateAuthCookies({
        prefix: ctx.db.config.cookiePrefix,
        value: data.token,
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

    await generateAuthCookies({
      prefix: ctx.db.config.cookiePrefix,
      value: data.token,
    });
    return data;
  }),
});
