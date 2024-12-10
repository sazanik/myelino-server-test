const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const IMAGES_DIR = path.join(process.cwd(), 'data/images');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PLANS_FILE = path.join(DATA_DIR, 'plans.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(IMAGES_DIR, { recursive: true });
  }
};

const ensureFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]'); // Если файл не существует, создаем его с пустым массивом
  }
};

const setupFiles = async () => {
  Promise.all([
    ensureDataDir(),
    ensureFileExists(USERS_FILE),
    ensureFileExists(PLANS_FILE),
    ensureFileExists(EVENTS_FILE),
  ]);
};

setupFiles().catch(() => {
  console.error(1);
});

const readJsonFile = async filePath => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// User Storage Operations
const readUser = async (id) => {
  const users = await readJsonFile(USERS_FILE);
  return users.find(user => user.id === id);
};

const findUserByUsernameOrEmail = async (identifier) => {
  const users = await readJsonFile(USERS_FILE);
  return users.find(user => user.username === identifier || user.email === identifier);
};

const createUser = async user => {
  const [existingUserByEmail, existingUserByUsername] = await Promise.all([
    findUserByUsernameOrEmail(user.email),
    findUserByUsernameOrEmail(user.username)
  ])

  if (existingUserByEmail) {
    throw new Error('User with this email already exists');
  }

  if (existingUserByUsername) {
    throw new Error('User with this username already exists');
  }

  const users = await readJsonFile(USERS_FILE);
  const newUser = { ...user, id: (users.length + 1).toString() };

  users.push(newUser);
  await writeJsonFile(USERS_FILE, users);

  return newUser;
};

const deleteUser = async (id) => {
  const users = await readJsonFile(USERS_FILE);
  const updatedUsers = users.filter(user => user.id !== id);

  const plans = await readJsonFile(PLANS_FILE);
  const filteredPlans = plans.filter(plan => plan.userId !== id);

  const events = await readJsonFile(EVENTS_FILE);
  const filteredEvents = events.filter(event => event.userId !== id);

  Promise.all([
    writeJsonFile(USERS_FILE, updatedUsers),
    writeJsonFile(PLANS_FILE, filteredPlans),
    writeJsonFile(EVENTS_FILE, filteredEvents),
  ]);
};

// Plan Storage Operations
const readPlans = async (userId, id) => {
  const plans = await readJsonFile(PLANS_FILE);

  if (userId && id) {
    return plans.find(plan => plan.userId === userId && plan.id === id);
  }

  return plans.filter(plan => plan.userId === userId);
};

const createPlan = async plan => {
  const plans = await readJsonFile(PLANS_FILE);

  const existingPlan = plans.find(ePlan => ePlan.name === plan.name);

  if (existingPlan) {
    throw new Error('Plan with this name already exists');
  }

  const newPlan = { ...plan, id: (plans.length + 1).toString() };
  plans.push(newPlan);
  await writeJsonFile(PLANS_FILE, plans);

  return newPlan;
};

const deletePlan = async (id) => {
  const plans = await readJsonFile(PLANS_FILE);
  const filteredPlans = plans.filter(plan => plan.id !== id);

  const events = await readJsonFile(EVENTS_FILE);
  const filteredEvents = events.filter(event => event.planId !== id);

  Promise.all([
    writeJsonFile(PLANS_FILE, filteredPlans),
    writeJsonFile(EVENTS_FILE, filteredEvents),
  ]);

};

// Event Storage Operations
const readEvents = async (userId, planId, id) => {
  const events = await readJsonFile(EVENTS_FILE);

  if (userId && planId && id) {
    return events.find(event => userId === event.userId && event.planId === planId && event.id === id);
  }

  return events.filter(event => userId === event.userId && event.planId === planId);
};

const createEvent = async event => {
  const events = await readJsonFile(EVENTS_FILE);

  const existingEvent = events.find(eEvent => eEvent.name === event.name);

  if (existingEvent) {
    throw new Error('Event with this name already exists');
  }

  const newEvent = { ...event, id: (events.length + 1).toString() };
  events.push(newEvent);
  await writeJsonFile(EVENTS_FILE, events);

  return newEvent;
};

const updateEvent = async (id, updatedData) => {
  const events = await readJsonFile(EVENTS_FILE);
  const eventIndex = events.findIndex(event => event.id === id);

  if (eventIndex === -1) {
    throw new Error('404: Event not found');
  }

  const updatedEvent = { ...events[eventIndex], ...updatedData };

  events[eventIndex] = updatedEvent;

  await writeJsonFile(EVENTS_FILE, events);

  return updatedEvent;
};

const deleteEvent = async id => {
  const events = await readJsonFile(EVENTS_FILE);
  const filteredEvents = events.filter(event => event.id !== id);
  await writeJsonFile(EVENTS_FILE, filteredEvents);
};

module.exports = {
  createUser,
  readUser,
  findUserByUsernameOrEmail,
  deleteUser,
  createEvent,
  updateEvent,
  deleteEvent,
  createPlan,
  deletePlan,
  readPlans,
  readEvents,
};
