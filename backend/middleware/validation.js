// Minimal validation helpers (could be upgraded to Joi/Zod later)

function validate(fields, rules) {
  const errors = [];
  for (const [name, ruleSet] of Object.entries(rules)) {
    const value = fields[name];
    for (const rule of ruleSet) {
      const result = rule.validator(value, fields);
      if (!result) {
        errors.push(rule.message || `${name} is invalid`);
        break; // stop at first failure for this field
      }
    }
  }
  return errors;
}

const rules = {
  required: (message) => ({
    validator: (v) => v !== undefined && v !== null && String(v).trim() !== '',
    message
  }),
  minLen: (len, message) => ({
    validator: (v) => typeof v === 'string' && v.trim().length >= len,
    message
  }),
  oneOf: (allowed, message) => ({
    validator: (v) => allowed.includes(v),
    message
  })
};

module.exports = { validate, rules };
