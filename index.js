const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const axios = require("axios");
const app = express();


const schema = buildSchema(`
type Post {
    id:Int
    userId:Int
    title:String
    body:String
}

type Query{
    hello : String
    welcomeMessage(name:String, day:String!) : String
    getPostExternalAPI:[Post]
}

type Mutation{
    setMessage(newMessage : String) :String
    setPost(id:Int!,userId:Int,title:String!,body:String) : Post
}
`);

const root = {
  hello: () => {
    return "Hello World";
  },
  welcomeMessage: (args) => {
    return `welcome ${args.name}, today is ${args.day}`;
  },

  getPostExternalAPI: async () => {
    const result = await axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.data);
    return result;
  },
  setMessage: ({ newMessage }) => {
    return newMessage;
  },
  setPost: ({id, userId, title, body}) => {
    return {id, userId, title, body};
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
  })
);

app.listen(4000, () => console.log("server is running on port 4000"));
