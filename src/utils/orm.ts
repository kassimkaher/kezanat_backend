function hydrate<T>(Model: new (...args: any[]) => T, json: any): T {
    // Create an instance of the model
    const instance = new Model();

    // Iterate over the keys of the JSON object
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            // Assign the value from JSON to the model instance
            (instance as any)[key] = json[key];
        }
    }

    return instance;
}
export { hydrate };
