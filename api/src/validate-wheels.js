const Ajv = require("ajv").default;
const { wheelSchema } = require("./wheel-schema");

const ajv = new Ajv({strict:false});
const validateWheels = ajv.compile(wheelSchema);

exports.validateWheels = validateWheels;
