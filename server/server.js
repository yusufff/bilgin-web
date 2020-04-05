const io = require("socket.io"),
server = io.listen(8000);

let sequenceNumberByClient = new Map();

const events = [
  ['gamerCount', 20],
  ['gamerCount', 50],
  ['startBuffer', { duration: 3000 }],
  ['startGame', true],
  ['getQuestion', {
    title: 'Nedir?',
    answers: ['asd', 'vcxv', 'czxc'],
    answers: 'vcxv',
    duration: 60000
  }],
  ['gamerCount', 150],
  ['getQuestion', {
    title: 'Ne değildir?',
    answers: ['asd', 'vcxv', 'czxc'],
    answers: 'czxc',
    duration: 60000
  }],
  ['getStats', [
    {
      username: 'asd',
      score: 5,
    },
    {
      username: '246xb',
      score: 10,
    },
    {
      username: 'dffhj',
      score: 2500,
    }
  ]],
  ['startLastStats', [
    {
      username: 'asd',
      score: 2500,
    },
    {
      username: '246xb',
      score: 4000,
    },
    {
      username: 'dffhj',
      score: 1245,
    }
  ]],
]

server.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  sequenceNumberByClient.set(socket);

  let queue = 0;
  let timeouts = [];
  for (let index = 0; index < events.length; index++) {
    const [name, data] = events[index];
    const prevDuration = (events[index - 1] && events[index - 1][1] && events[index - 1][1].duration) || 0
    queue += ((prevDuration) + 5000);
    console.log(queue)
    const event = setTimeout(() => {
      socket.emit(name, data);
      console.log(name, data);
    }, queue)
    timeouts.push(event);
  }

  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    for (let event = 0; event < timeouts.length; event++) {
      const timeout = timeouts[event];
      clearTimeout(timeout);
    }
    console.info(`Client gone [id=${socket.id}]`);
  });
});