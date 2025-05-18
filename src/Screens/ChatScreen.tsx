import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CometChatConversations, CometChatIncomingCall, CometChatThemeProvider, CometChatUiKitConstants } from '@cometchat/chat-uikit-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ViewStyle } from 'react-native';
import Messages from '../components/Messages';

const ChatScreen = () => {
  const [messageUser, setMessageUser] = useState<CometChat.User>();
  const [messageGroup, setMessageGroup] = useState<CometChat.Group>();
  const incomingCall = useRef<CometChat.Call | CometChat.CustomMessage | null>(
      null,
    );
  const [callReceived, setCallReceived] = useState(false);
  var listenerID: string = 'UNIQUE_LISTENER_ID';

  useEffect(() => {
      // Register the call listener when the component mounts or when login state changes
      CometChat.addCallListener(
        listenerID,
        new CometChat.CallListener({
          // Fired when an incoming call is received
          onIncomingCallReceived: (call: CometChat.Call) => {
            // Store the incoming call and update state.
            incomingCall.current = call;
            // Trigger UI to show incoming call screen
            setCallReceived(true);
          },
          // Fired when an outgoing call is rejected by the recipient
          onOutgoingCallRejected: () => {
            // Clear the call state if outgoing call is rejected.
            incomingCall.current = null; // Clear the call object
            setCallReceived(false); // Hide any call UI
          },
          onIncomingCallCancelled: () => {
            // Clear the call state if the incoming call is cancelled.
            incomingCall.current = null;
            setCallReceived(false);
          },
        }),
      );

      // Cleanup: remove the call listener when the component unmounts or before re-running
      return () => {
        CometChat.removeCallListener(listenerID);
      };
    }, [listenerID]);


  return (
    <SafeAreaView style={styles.fullScreen}>
             <CometChatThemeProvider>
             Show conversations only after the user is logged in
               <>
               {callReceived && incomingCall.current ? (
             <CometChatIncomingCall
               call={incomingCall.current}
               onDecline={() => {
                  //Handle call decline by clearing the incoming call state.
                  incomingCall.current = null; // Clear the call object
                  setCallReceived(false);  // Hide the incoming call UI
                }}
              />
           ) : null}
                 Conversation list (hidden when a chat is open)
                 <CometChatConversations
                   style={{
                    containerStyle: {
                      display: messageUser || messageGroup ? 'none' : 'flex',
                    },
                  }}
                   onItemPress={(conversation: CometChat.Conversation) => {
                    if (
                      conversation.getConversationType() ===
                      CometChatUiKitConstants.ConversationTypeConstants.user
                    ) {
                      setMessageUser(
                        conversation.getConversationWith() as CometChat.User,
                      );
                      return;
                    }
                    setMessageGroup(
                      conversation.getConversationWith() as CometChat.Group,
                    );
                  }}
                 />
                 Active chat screen 
                {(messageUser || messageGroup) && (
                  <Messages
                    user={messageUser}
                    group={messageGroup}
                    onBack={() => {
                      setMessageUser(undefined);
                      setMessageGroup(undefined);
                    }}
                  />
                )}
              </>
           </CometChatThemeProvider>
        </SafeAreaView>
  );
};
const styles: {fullScreen: ViewStyle} = {
  fullScreen: {flex: 1},
};

export default ChatScreen;
