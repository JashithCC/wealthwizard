import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { Send, Bot, User } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function AssistantScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your WealthWizard AI assistant. How can I help with your finances today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simulate API call to AI service
      const response = await fetchAIResponse(input.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock responses based on user input
      if (userMessage.toLowerCase().includes('budget')) {
        return "Based on your spending patterns, I recommend allocating 50% of your income to necessities, 30% to wants, and 20% to savings and debt repayment. Your current spending shows you're using 60% on necessities, 35% on wants, and only 5% on savings. Would you like me to suggest specific areas where you could cut back?";
      } else if (userMessage.toLowerCase().includes('invest') || userMessage.toLowerCase().includes('investment')) {
        return "Your round-up investments have grown by 10.69% this year! That's great progress. Based on your risk tolerance profile, I'd suggest increasing your ETF allocation. Would you like me to show you some options that match your investment goals?";
      } else if (userMessage.toLowerCase().includes('save') || userMessage.toLowerCase().includes('saving')) {
        return "You're currently saving about 5% of your income. To reach your goal of a $10,000 emergency fund by next year, you'll need to increase that to 12%. I've identified potential savings of $150/month by reducing dining expenses and $85/month by optimizing your subscription services.";
      } else if (userMessage.toLowerCase().includes('debt') || userMessage.toLowerCase().includes('loan')) {
        return "I see you have a credit card balance of $2,340.15 with an estimated APR of 18%. If you increase your monthly payment by $100, you could be debt-free 8 months sooner and save approximately $215 in interest. Would you like me to create a debt repayment plan?";
      } else {
        return "Thanks for your message. I can help you with budgeting, investment advice, savings goals, debt management, and analyzing your spending patterns. What specific aspect of your finances would you like to focus on today?";
      }
    } catch (error) {
      console.error('Error in fetchAIResponse:', error);
      throw error;
    }
  };
  
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble
        ]}>
          <View style={styles.messageHeader}>
            <View style={[
              styles.avatarContainer,
              isUser ? styles.userAvatar : styles.assistantAvatar
            ]}>
              {isUser ? (
                <User size={16} color={colors.dark.text} />
              ) : (
                <Bot size={16} color={colors.dark.text} />
              )}
            </View>
            <Text style={styles.senderName}>
              {isUser ? 'You' : 'WealthWizard AI'}
            </Text>
          </View>
          
          <Text style={styles.messageText}>{item.text}</Text>
          
          <Text style={styles.timestamp}>
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Financial Assistant</Text>
      </View>
      
      <Card style={styles.assistantInfo}>
        <View style={styles.assistantHeader}>
          <View style={styles.assistantIconContainer}>
            <Bot size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.assistantName}>WealthWizard AI</Text>
            <Text style={styles.assistantDescription}>
              Your personal financial advisor
            </Text>
          </View>
        </View>
        
        <Text style={styles.assistantCapabilities}>
          Ask me about budgeting, investment advice, savings goals, debt management, 
          and spending analysis.
        </Text>
      </Card>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask something about your finances..."
          placeholderTextColor={colors.dark.textSecondary}
          multiline
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            (!input.trim() || isLoading) && styles.disabledButton
          ]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Send size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    padding: 16,
  },
  title: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  assistantInfo: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  assistantIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}30`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assistantName: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  assistantDescription: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  assistantCapabilities: {
    color: colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: colors.primary,
  },
  assistantBubble: {
    backgroundColor: colors.dark.card,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    backgroundColor: `${colors.dark.text}30`,
  },
  assistantAvatar: {
    backgroundColor: `${colors.primary}30`,
  },
  senderName: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  messageText: {
    color: colors.dark.text,
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    backgroundColor: colors.dark.card,
  },
  input: {
    flex: 1,
    backgroundColor: colors.dark.cardAlt,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.dark.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});