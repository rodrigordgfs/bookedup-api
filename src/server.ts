import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { createUserRoute } from "./http/users/create-user.ts";
import { createCategoryRoute } from "./http/categories/create-category.ts";
import { getCategoriesRoute } from "./http/categories/get-categories.ts";
import { updateCategoryRoute } from "./http/categories/update-category.ts";
import { deleteCategoryRoute } from "./http/categories/delete-category.ts";
import { createServiceRoute } from "./http/services/create-service.ts";
import { getServicesRoute } from "./http/services/get-services.ts";
import { updateServiceRoute } from "./http/services/update-service.ts";
import { deleteServiceRoute } from "./http/services/delete-service.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", () => {
  return { status: "ok" };
});

// User
app.register(createUserRoute);

// Category
app.register(createCategoryRoute);
app.register(getCategoriesRoute);
app.register(updateCategoryRoute);
app.register(deleteCategoryRoute);

// Service
app.register(createServiceRoute);
app.register(getServicesRoute);
app.register(updateServiceRoute);
app.register(deleteServiceRoute);

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
