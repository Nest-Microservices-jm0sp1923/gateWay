import "dotenv/config"
import * as joi from "joi"

interface EnvVars {
    PORT: number 
    PRODUCTS_MIRCOSERVICES_HOST: string
    PRODUCTS_MIRCOSERVICES_PORT: number
    ORDERS_MIRCOSERVICES_HOST: string
    ORDERS_MIRCOSERVICES_PORT: number
    NATS_SERVERS: string[]
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    PRODUCTS_MIRCOSERVICES_HOST: joi.string().required(),
    PRODUCTS_MIRCOSERVICES_PORT: joi.number().required(),
    ORDERS_MIRCOSERVICES_HOST: joi.string().required(),
    ORDERS_MIRCOSERVICES_PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required()
}).unknown(true)

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});

if(error){
    throw new Error(`Config Validation error: ${error.message}`)
}

const envVars:EnvVars = value

export const envs = {
    PORT: envVars.PORT,
    
    productsMicroservicesHost: envVars.PRODUCTS_MIRCOSERVICES_HOST,
    productsMicroservicesPort: envVars.PRODUCTS_MIRCOSERVICES_PORT,

    ordersMicroservicesHost: envVars.ORDERS_MIRCOSERVICES_HOST,
    ordersMicroservicesPort: envVars.ORDERS_MIRCOSERVICES_PORT,

    
    NATS_SERVERS: envVars.NATS_SERVERS
}