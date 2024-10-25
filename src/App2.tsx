import { defineComponent, ref, type PropType } from "vue";

export const Demo = defineComponent(
  (props: {
    type: {
      setting: { url: string };
    };
  }) => {
    const url = props.type.setting.url;
    const { url: url2 } = props.type.setting;
    const { setting } = props.type;
    return () => {
      return (
        <div>
          <p>{url}</p>
          <p>{url2}</p>
          <p>{props.type.setting.url}</p>
          <p>{setting.url}</p>
        </div>
      );
    };
  },
  {
    props: {
      type: Object as PropType<{
        setting: { url: string };
      }>,
    },
  }
);
const MyComponent = defineComponent(
  (props: { title: string; likes?: number }) => {
    return () => (
      <div>
        <h1>{props.title}</h1>
        <p>This post has {props.likes} likes.</p>
      </div>
    );
  }
);
export const App = defineComponent(() => {
  const url = ref(1);

  return () => (
    <>
      <Demo type={{ setting: { url: url.value + "" } }}></Demo>
      <MyComponent title="xxxxxxxxx" likes={123} />
      <button
        onClick={() => {
          url.value += 1;
        }}
      >
        xxxxxxxx
      </button>
    </>
  );
});
