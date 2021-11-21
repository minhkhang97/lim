import express from "express";

import { App } from "./app";
import { ProductController } from "./src/controllers/product.controller";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

(async () => {
  const app = new App({
    port: 3000,
    controllers: [
      new ProductController(),
    ],
    middleware: [
      express.json(),
      express.urlencoded({ extended: true }),
    ]
  })
  await prisma.$connect();
  //new Guard(new UserService()).guardForUser(passport);
  app.start();
  await prisma.$disconnect();
})();