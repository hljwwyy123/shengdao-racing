import { useLayoutEffect } from "react";
import Taro from '@tarojs/taro'
import "../../commonstyle/richtext.less"

interface IProps {
  nodes: string
}
export default function RichText(props: IProps) {
  const { nodes = '' } = props;

  useLayoutEffect(() => {
    (Taro as any).options.html.transformElement = el => {
      if (el.nodeName === 'image') {
        el.setAttribute('mode', 'widthFix');
        el.__handlers.tap = [() =>{
          imgClick(el.props.src)
        }]
      }
      return el;
    };
  }, [nodes])

  const imgClick = (src: string) => {
    if (!src) return
    Taro.previewImage({
      current: src,
      urls: [src]
    })
  }
  return <div className="rich-text">
      <div dangerouslySetInnerHTML={{__html: nodes }}></div>
  </div>
}
