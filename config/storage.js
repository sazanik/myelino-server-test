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
  await ensureDataDir();

  await ensureFileExists(USERS_FILE);
  await ensureFileExists(PLANS_FILE);
  await ensureFileExists(EVENTS_FILE);
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
const readUser = async id => {
  const users = await readJsonFile(USERS_FILE);
  return users.find(user => user.id === id);
};

const findUserByUsernameOrEmail = async ({ username, email }) => {
  const users = await readJsonFile(USERS_FILE);
  return users.find(user => user.username === username || user.email === email);
};

const createUser = async user => {
  const existingUser = await findUserByUsernameOrEmail({ username: user.username, email: user.email });

  if (existingUser) {
    throw new Error(JSON.stringify({ message: 'User with this username or email already exists' }));
  }

  const users = await readJsonFile(USERS_FILE);
  const newUser = { ...user, id: users.length + 1 };

  users.push(newUser);
  await writeJsonFile(USERS_FILE, users);

  return newUser;
};

// Plan Storage Operations
const readPlans = async userId => {
  const plans = await readJsonFile(PLANS_FILE);
  return plans.filter(plan => plan.userId === userId);
};

const createPlan = async plan => {
  const plans = await readJsonFile(PLANS_FILE);

  const existingPlan = plans.find(ePlan => ePlan.name === plan.name);

  if (existingPlan) {
    throw new Error(JSON.stringify({ message: 'Plan with this name already exists' }));
  }

  const newPlan = { ...plan, id: (plans.length + 1).toString() };
  plans.push(newPlan);
  await writeJsonFile(PLANS_FILE, plans);

  return newPlan;
};

const deletePlan = async (id) => {
  const plans = await readJsonFile(PLANS_FILE);
  const filteredPlans = plans.filter(plan => plan.id !== id);

  await writeJsonFile(PLANS_FILE, filteredPlans);
};

// Event Storage Operations
const readEvents = async planId => {
  const events = await readJsonFile < Event > (EVENTS_FILE);
  return events.filter(event => event.planId === planId);
};

const createEvent = async event => {
  const events = await readJsonFile(EVENTS_FILE);

  const existingEvent = events.find(eEvent => eEvent.name === event.name);

  if (existingEvent) {
    throw new Error(JSON.stringify({ message: 'Event with this name already exists' }));
  }

  const newEvent = { ...event, id: events.length + 1 };
  events.push(newEvent);
  await writeJsonFile(EVENTS_FILE, events);

  return newEvent;
};

const deleteEvent = async id => {
  const events = await readJsonFile(EVENTS_FILE);
  const filteredEvents = events.filter(event => event.id !== id);
  await writeJsonFile(EVENTS_FILE, filteredEvents);
};

module.exports = {
  createEvent,
  deleteEvent,
  createPlan,
  deletePlan,
  createUser,
  readUser,
  readPlans,
  readEvents,
};
