var pointer_pool = new Map([[0, { index: 1000000, free: [], id: Symbol("pointer_address") }]]);

function getPtrRef(ptr) {
    return pointer_pool.get(ptr);
}

function unlinkPtrRef(ptr) {
    const POOL = pointer_pool.get(0);

    if (pointer_pool.has(ptr) === true) {
        delete pointer_pool.get(ptr)[POOL.id];

        POOL.free.push(ptr);

        return pointer_pool.delete(ptr);
    }

    return false;
}

function createPtr(value) {
    const POOL = pointer_pool.get(0);

    if (POOL.id in value) {
        return value[POOL.id];
    }

    let ptr = undefined;

    if (POOL.free.length > 0) {
        ptr = POOL.free.pop();
    }

    if (ptr === undefined) {
        ptr = ++POOL.index;
    }

    value[POOL.id] = ptr;

    pointer_pool.set(ptr, value);

    return ptr;
}

function unlinkPtr(value) {
    const POOL = pointer_pool.get(0);

    if ((POOL.id in value) === false) {
        return false;
    }

    const PTR = value[POOL.id];

    delete value[POOL.id];

    if (pointer_pool.has(PTR) === true) {
        POOL.free.push(PTR);

        return pointer_pool.delete(PTR);
    }

    return false;
}

let user = { name: 'John', age: 32 };
let user_ptr = createPtr(user);

console.log({ user_ptr, ref: getPtrRef(user_ptr) });

unlinkPtrRef(user_ptr);

let car = { brand: 'BMW', model: 'M3', manufacture_year: 2003 };
let car_ptr = createPtr(car);

console.log({ car_ptr, ref: getPtrRef(car_ptr) });

unlinkPtr(car);

console.log({ car_ptr, ref: getPtrRef(car_ptr) });