import { faker } from '@faker-js/faker';

export function createRandomUser() {
    return {
        profile: faker.image.avatar(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int(40),
        visits: faker.number.int(1000),
        progress: faker.number.int(100),
    };
}

export const USERS = faker.helpers.multiple(createRandomUser, {
    count: 30,
});

export function createRandomTask() {
    return {
        id: faker.string.numeric(4),
        taskName: faker.lorem.sentence(),
        startDate: faker.date.recent(),
        dueDate: faker.date.soon(),
        completed: faker.number.int({ min: 1, max: 5 }),
        profile: faker.image.avatar(),
        fullName: faker.person.fullName(),
        progress: faker.number.int(0, 100, 10),
        object: faker.helpers.arrayElement(['container', 'vehile', 'ship', 'radio', 'monitor', 'next']),
        acquisitionYear: faker.helpers.arrayElement(['2023', '2024', '2025', '2026']),
        capability: faker.helpers.arrayElement(['movement', 'aircrafts', 'corvetes', 'weapons', 'tanks']),
        program: faker.helpers.arrayElement(['Air force', 'Land force', 'Navy force', 'Management']),
        projectPlaning: faker.helpers.arrayElement(['buy', 'produce', 'execute', 'create']),
        projectSystem: faker.helpers.arrayElement(['land', 'air', 'navy', 'special']),
        assetType: faker.helpers.arrayElement(['free', 'basic', 'business', 'main']),
    };
}

export const TASKS = faker.helpers.multiple(createRandomTask, {
    count: 100,
});

const range = (len) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int(40),
        visits: faker.number.int(1000),
        progress: faker.number.int(100),
        status: faker.helpers.shuffle(['relationship', 'complicated', 'single',])[0],
    }
}

export function makeData(...lens) {
    const makeDataLevel = (depth = 0) => {
        const len = lens[depth]
        return range(len).map((depth) => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        })
    }

    return makeDataLevel();
}

export const PERSON = faker.helpers.multiple(makeData, {
    count: 50,
});

const tasks = Array(30).fill(null).map((_, i) => "Task" + i);
const dep = Array(30).fill(null).map((_, i) => "Dep" + i)

function createItem() {
    return {
        name: "Funkcija" + Math.round(Math.random() * 100),
        task: tasks[Math.round(Math.random() * (tasks.length - 1))],
        dep: dep[Math.round(Math.random() * (dep.length - 1))],
    };
}

export const data = Array(100).fill(null).map(createItem);