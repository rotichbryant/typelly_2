import { NestFactory } from '@nestjs/core';
import { CompanyModule, RoleModule, UserModule } from './modules';
import { CompanyModel, RoleModel, UserModel } from './models';

const { isEmpty }  = require('lodash');
const randomstring = require("randomstring");
const fs           = require("fs");
const os           = require("os");
const company      = {
    name: "Example",
    email: "info@example.com",
    phone_number: "+123455677"
}

const roles         = [
    { name: "admin"  },
    { name: "client" },
    { name: "staff"  }
];

var admin        = {
    email: "bryantkrotich@gmail.com",
    first_name: "Bryant",
    last_name: "Rotich",
    password: "password"
}, app;

async function init(){
    app = await NestFactory.createApplicationContext({CompanyModule,RoleModule,UserModule});
    await run();
}

async function run(){
    setEnvValue("APP_KEY",randomstring.generate(50));
    setEnvValue("JWT_SESSION_KEY",randomstring.generate(100));

    app.get(CompanyModel)
        .save(this.company)
        .then( (company) => {
            console.log("[COMPANY INSTALLATION DONE]")
            Promise.all(
                this.roles.map( async(role) => {
                    this.app
                        .get(RoleModel)
                        .save(role)
                        .then( () =>{
                            console.log("[ROLES INSTALLATION DONE]")
                        });
                })
            ).then( (roles) => {
                console.log(roles);
            //     this.admin['company_id'] = ;
            //     this.admin['role_id']    = roles.filter( val => val.name == "admin").id;
            //     this.userModel
            //         .save(this.admin)
            //         .then( () => {
            //             console.log("[USER INSTALLATION DONE]")
            //         });                 
            // });
            })
        })


}

function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS      = fs.readFileSync("./.env", "utf8").split(os.EOL);
    let   NEW_ENV_VARS  = [];

    // find the env we want based on the key
    if( !isEmpty(ENV_VARS) && ENV_VARS.length === 1 ){
        NEW_ENV_VARS = ENV_VARS[0].split('\n').map((item) => {
            const target = item.match(new RegExp(key));
            if( !isEmpty(target) ){
                item = `${target}=${value}`;
            }           
            return item;
        });
    } else if( !isEmpty(ENV_VARS) && ENV_VARS.length > 1 ){
        NEW_ENV_VARS = ENV_VARS.map((item) => {
            const target = item.match(new RegExp(key));
            if( !isEmpty(target) ){
                item = `${target}=${value}`;
            }
            return item;
        });
    }

    // // write everything back to the file system
    fs.writeFileSync("./.env", NEW_ENV_VARS.join(os.EOL));

}

init();