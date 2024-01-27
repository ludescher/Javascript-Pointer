var pointer_pool = new Map([[0, { index: 1000000, free: [], id: Symbol("pointer_address") }]]);

if (Number.prototype.hasOwnProperty("getPtrRef") === false) {
    Number.prototype.getPtrRef = function () {
        return pointer_pool.get(Number(this));
    };
}

if (Number.prototype.hasOwnProperty("unlinkPtrRef") === false) {
    Number.prototype.unlinkPtrRef = function () {
        const POOL = pointer_pool.get(0);

        POOL.free.push(this);

        return pointer_pool.delete(Number(this));
    };
}

if (Object.prototype.hasOwnProperty("createPtr") === false) {
    Object.prototype.createPtr = function () {
        const POOL = pointer_pool.get(0);
        let ptr = undefined;

        if (POOL.free.length > 0) {
            ptr = POOL.free.pop();
        }

        if (ptr === undefined) {
            ptr = ++POOL.index;
        }

        this[POOL.id] = ptr;

        pointer_pool.set(ptr, this);

        return ptr;
    };
}

if (Object.prototype.hasOwnProperty("unlinkPtr") === false) {
    Object.prototype.unlinkPtr = function () {
        const POOL = pointer_pool.get(0);
        const PTR = this[POOL.id];

        delete this[POOL.id];

        POOL.free.push(PTR);

        return pointer_pool.delete(PTR);
    };
}

let user = { name: 'John', age: 32 };
let user_ptr = user.createPtr();

console.log({ user_ptr, ref: user_ptr.getPtrRef() });

user.unlinkPtr();

let car = { brand: 'BMW', model: 'M3', manufacture_year: 2003 };
let car_ptr = car.createPtr();

console.log({ car_ptr, ref: car_ptr.getPtrRef() });

car.unlinkPtr();

console.log({ car_ptr, ref: car_ptr.getPtrRef() });