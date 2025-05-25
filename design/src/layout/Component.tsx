import { Image, Popover  } from 'antd'

export default function Component({ component }: { component: Design.ComponentConfig }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Image src={component.thumbnail} />
      <Popover title={component.name} content={component.desc} placement="right">
        <p>{component.name}</p>
      </Popover>
    </div>
  )
}


