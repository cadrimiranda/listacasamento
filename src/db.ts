"use client";
import mongoose from "mongoose";

class Database {
  private mongoUrl: string =
    "mongodb+srv://cadrimiranda:q5HCXE7kVdaZ1gQI@recipies.jdyf9.mongodb.net/?retryWrites=true&w=majority";
  private static instance: Database;
  private connection: mongoose.Connection | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.connection) {
      return;
    }

    await mongoose.connect(this.mongoUrl).catch((error) => console.log(error));
    mongoose.Promise = global.Promise;

    this.connection = mongoose.connection;
    console.log("Conexão com o MongoDB estabelecida");
  }

  public disconnect(): void {
    if (!this.connection) {
      throw new Error("A conexão com o banco de dados não foi estabelecida.");
    }

    mongoose.disconnect();
    console.log("Conexão com o MongoDB encerrada");
  }

  public getConnection(): mongoose.Connection {
    if (!this.connection) {
      throw new Error(
        "A conexão com o banco de dados ainda não foi estabelecida."
      );
    }

    return this.connection;
  }
}

export default Database;
