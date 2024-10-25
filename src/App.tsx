import { defineComponent, shallowRef, watchEffect, ShallowRef } from "vue";
const createTimer = () => {
  const timer = shallowRef<string>(new Date().toString());
  setInterval(() => {
    timer.value = new Date().toString();
    console.log(`timer.value`, timer.value);
  }, 1000);
  return timer;
};
function useWatch<T>(cb: () => T) {
  const target = shallowRef<T>();
  watchEffect(() => {
    const next = cb();
    target.value = next;
  });
  return target;
}

// 用来模拟独立的数据层，lazy 指的是当组件需要数据层响应式数据时再创建
let cache: ShallowRef<string | undefined>;
const getZLazy = () => {
  if (!cache) {
    const timer = createTimer();
    cache = useWatch(() => {
      console.log('lazywatch 🐛 x', timer.value)
      return timer.value;
    });
  }
  return cache;
};

const LazyComponent = defineComponent({
  setup() {
    const lazyZ = getZLazy();
    return () => <div>B 组件{lazyZ.value}</div>;
  },
});

export const App = defineComponent({
  setup() {
    const visible = shallowRef(false);
    return () => (
      <div>
        <button
          onClick={() => {
            visible.value = !visible.value;
          }}
        >
          点击对 LazyComponent 组件进行挂载和卸载
        </button>
        {visible.value && <LazyComponent />}
      </div>
    );
  },
});
