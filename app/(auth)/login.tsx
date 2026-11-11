import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { colors, spacing } from '@/lib/theme';
import { auth } from '@/services/firebase';

function traduzirErro(e: unknown): string {
  const codigo = (e as { code?: string })?.code ?? '';
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-disabled':
      return 'Este usuário está desativado.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de rede. Verifique sua conexão.';
    default:
      return 'Não foi possível entrar. Tente novamente.';
  }
}

export default function Login() {
  const { mostrar } = useToast();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    if (!email.trim() || !senha) {
      mostrar('Informe e-mail e senha.', 'erro');
      return;
    }
    setEnviando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      // O redirecionamento para o painel é feito pelo guarda de rotas.
    } catch (e) {
      mostrar(traduzirErro(e), 'erro');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.primary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.marca}>
          <Ionicons name="leaf" size={56} color={colors.accent} />
          <Text style={styles.titulo}>Agro Frotas</Text>
          <Text style={styles.subtitulo}>Gestão de máquinas agrícolas</Text>
        </View>

        <View style={styles.formulario}>
          <Input
            rotulo="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="voce@fazenda.com"
          />
          <Input
            rotulo="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="••••••••"
            onSubmitEditing={entrar}
          />
          <Button titulo="Entrar" onPress={entrar} carregando={enviando} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  marca: { alignItems: 'center', marginBottom: spacing.xl },
  titulo: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: spacing.sm },
  subtitulo: { color: '#CFE0D3', fontSize: 15 },
  formulario: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
});
