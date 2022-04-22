import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "node:http";
import path from "node:path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { WebSocketServer } from "ws";
import { UserResolver } from "./resolvers/user.resolver";

async function server() {
  const app = express();
  const httpServer = createServer(app);

  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

server();
