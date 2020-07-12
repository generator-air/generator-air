import $bus from '@/mixin/bus';

const notify = (msg, options) => {
  if (msg && msg.toString) {
    msg = msg.toString();
  }

  let para = Object.assign(
    {
      title: '消息',
      type: 'info',
    },
    options
  );
  para.message = msg;

  $bus.emit('notify', para);
};

notify.info = (msg, title) => {
  notify(msg, {
    type: 'info',
    title,
  });
};

notify.error = (msg, title) => {
  notify(msg, {
    type: 'error',
    title,
  });
};

notify.warn = (msg, title) => {
  notify(msg, {
    type: 'warning',
    title,
  });
};

notify.success = (msg, title) => {
  notify(msg, {
    type: 'success',
    title,
  });
};

export default notify;
