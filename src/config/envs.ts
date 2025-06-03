import "dotenv/config"
import * as joi from "joi"

interface EnvVars {
    PORT: number
    PRODUCTS_MIRCOSERVICES_HOST: string
    PRODUCTS_MIRCOSERVICES_PORT: number
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    PRODUCTS_MIRCOSERVICES_HOST: joi.string().required(),
    PRODUCTS_MIRCOSERVICES_PORT: joi.number().required()
}).unknown(true)

const {error, value} = envsSchema.validate(process.env)

if(error){
    throw new Error(`Config Validation error: ${error.message}`)
}

const envVars:EnvVars = value

export const envs = {
    PORT: envVars.PORT,
    productsMicroservicesHost: envVars.PRODUCTS_MIRCOSERVICES_HOST,
    productsMicroservicesPort: envVars.PRODUCTS_MIRCOSERVICES_PORT
}