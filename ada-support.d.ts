interface SensitiveMetaFieldsProps {
  ada_token?: string
}

interface MetaFieldsProps {
  uuid?: string
  origin?: string
}

// As defined by https://developers.ada.cx/reference/react-native-sdk-reference
interface AdaEmbedViewProps {
  handle: string
  cluster?: string
  styles?: string

  language?: string
  greeting?: string

  metaFields?: MetaFieldsProps
  sensitiveMetaFields?: SensitiveMetaFieldsProps
  deviceToken?: string
  thirdPartyCookiesEnabled?: boolean

  zdChatterAuthCallback?: () => void
  eventCallbacks?: {}
  endConversationCallback?: () => void
}

declare module '@ada-support/react-native-sdk' {
  export default class AdaEmbedView extends React.Component<AdaEmbedViewProps> {}
}
