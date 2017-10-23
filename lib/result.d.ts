/**
 * A successful validation result.
 */
export declare type Success<A> = {
    /**
     * A tag indicating success.
     */
    success: true;
    /**
     * The original value, cast to its validated type.
     */
    value: A;
};
/**
 * A failed validation result.
 */
export declare type Failure = {
    /**
     * A tag indicating failure.
     */
    success: false;
    /**
     * A message indicating the reason validation failed.
     */
    message: string;
};
/**
 * The result of a type validation.
 */
export declare type Result<A> = Success<A> | Failure;
