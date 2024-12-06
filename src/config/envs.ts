
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    SHOPPING_CART_MICROSERVICE_HOST: string;
    SHOPPING_CART_MICROSERVICE_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    SHOPPING_CART_MICROSERVICE_HOST: joi.string().required(),
    SHOPPING_CART_MICROSERVICE_PORT: joi.number().required(),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    shoppingCartMicroserviceHost: envVars.SHOPPING_CART_MICROSERVICE_HOST,
    shoppingCartMicroservicePort: envVars.SHOPPING_CART_MICROSERVICE_PORT,
}