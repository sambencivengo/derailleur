// Prisma Client (Query Engine)
export enum PrismaQueryErrorCodes {
  // "The provided value for the column is too long for the column's type. Column: {column_name}"
  VALUE_TOO_LONG = "P2000",

  // "The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist"
  WHERE_CONDITION_DOESNT_EXIST = "P2001",

  // "Unique constraint failed on the {constraint}"
  UNIQUE_CONSTRAINT = "P2002",

  // "Foreign key constraint failed on the field: {field_name}"
  FOREIGN_KEY_CONSTRAINT = "P2003",

  // "A constraint failed on the database: {database_error}"
  CONSTRAINT_FAILED = "P2004",

  // "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type"
  INVALID_FIELD_VALUE_TYPE = "P2005",

  // // "The provided value {field_value} for {model_name} field {field_name} is not valid"
  // "P2006",

  // // "Data validation error {database_error}"
  // "P2007",

  // // "Failed to parse the query {query_parsing_error} at {query_position}"
  // "P2008",

  // // "Failed to validate the query: {query_validation_error} at {query_position}"
  // "P2009",

  // // "Raw query failed. Code: {code}. Message: {message}"
  // "P2010",

  // // "Null constraint violation on the {constraint}"
  // "P2011",

  // // "Missing a required value at {path}"
  // "P2012",

  // // "Missing the required argument {argument_name} for field {field_name} on {object_name}."
  // "P2013",

  // // "The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models."
  // "P2014",

  // // "A related record could not be found. {details}"
  // "P2015",

  // // "Query interpretation error. {details}"
  // "P2016",

  // // "The records for relation {relation_name} between the {parent_name} and {child_name} models are not connected."
  // "P2017",

  // // "The required connected records were not found. {details}"
  // "P2018",

  // // "Input error. {details}"
  // "P2019",

  // // "Value out of range for the type. {details}"
  // "P2020",

  // // "The table {table} does not exist in the current database."
  // "P2021",

  // // "The column {column} does not exist in the current database."
  // "P2022",

  // // "Inconsistent column data: {message}"
  // "P2023",

  // // "Timed out fetching a new connection from the connection pool. (More info: http://pris.ly/d/connection-pool (Current connection pool timeout: {timeout}, connection limit: {connection_limit})"
  // "P2024",

  // // "An operation failed because it depends on one or more records that were required but not found. {cause}"
  // "P2025",

  // // "The current database provider doesn't support a feature that the query used: {feature}"
  // "P2026",

  // // "Multiple errors occurred on the database during query execution: {errors}"
  // "P2027",

  // // "Transaction API error: {error}"
  // "P2028",

  // // "Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema"
  // "P2030",

  // // "Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set. See details: https://pris.ly/d/mongodb-replica-set"
  // "P2031",

  // // "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers"
  // "P2033",

  // // "Transaction failed due to a write conflict or a deadlock. Please retry your transaction"
  // "P2034",
}