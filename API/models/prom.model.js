const mongoose =require( "mongoose");




class Prom {
    static #schema =new mongoose.Schema({
        email:{
            type:String,
            required:true
        },
        code:{
            type:String,
            required:true
        }, 
            name:{
            type:String,
                required:true
        }
        });
  
    static getModel() {
      return mongoose.model("Prom", this.#schema);
    }
  }
  
  module.exports = Prom.getModel();
  
  
