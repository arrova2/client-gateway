// import 'dotenv/config';

// import * as joi from 'joi';

// interface EnvVars {
//     PORT: number;
//     PRODUCTS_MICROSERVICE_HOST: string;
//     PRODUCTS_MICROSERVICE_PORT: number;
//     ORDERS_MICROSERVICE_HOST: string;
//     ORDERS_MICROSERVICE_PORT: number;
// }

// const evnsSchema = joi.object({
//     PORT: joi.number().required(),
//     PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
//     PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
//     ORDERS_MICROSERVICE_HOST: joi.string().required(),
//     ORDERS_MICROSERVICE_PORT: joi.number().required(),
// }).unknown(true);

// const { error, value } = evnsSchema.validate( process.env );

// if(error){
//     throw new Error( `Config validation error: ${ error.message }` );
// }

// const envVars: EnvVars = value;

// export const envs = {
//     port: envVars.PORT,
//     productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
//     productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
//     ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
//     ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
// }

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    // DATABASE_URL: string;

    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    // DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( {
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if( error ){
    throw new Error(`Config validation error: ${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    // databaseUrl: envVars.DATABASE_URL,
    natsServers: envVars.NATS_SERVERS,
}