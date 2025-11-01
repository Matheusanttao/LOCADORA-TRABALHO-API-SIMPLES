# 🧪 Guia Completo de Testes - CineMax Locadora

Este guia vai te ajudar a testar todas as funcionalidades do aplicativo e verificar se está tudo funcionando corretamente.

## 🚀 Passo 1: Executar o Aplicativo

### Opção A: No Celular (Recomendado)
```bash
npm start
```
- Escaneie o QR Code com o app Expo Go
- Aguarde o app carregar

### Opção B: No Navegador (Para ver layout rápido)
```bash
npm run web
```
⚠️ **Nota**: SQLite pode não funcionar no navegador. Use celular/emulador para testar banco de dados.

---

## ✅ Checklist de Testes

### 📱 Tela 1: Splash Screen (Tela Inicial)

**O que verificar:**
- [ ] A tela de splash aparece ao iniciar o app
- [ ] A tela de splash dura aproximadamente 3 segundos
- [ ] Não há erros no console durante o carregamento
- [ ] A mensagem "Banco de dados inicializado com sucesso" aparece no console

**Como verificar:**
- Execute o app e observe a tela inicial
- Abra o menu de desenvolvimento (agite o celular ou pressione `m` no terminal)
- Verifique o console para erros

---

### 🎬 Tela 2: Lista de Filmes (Tab "Filmes")

**O que verificar:**
- [ ] A lista de filmes é exibida corretamente
- [ ] Os filmes mostram: título, gênero, classificação (⭐), data de lançamento
- [ ] Os filmes têm imagens de placeholder
- [ ] É possível fazer scroll na lista
- [ ] O botão de "Favorito" aparece em cada filme
- [ ] É possível clicar em um filme para ver detalhes
- [ ] O indicador de carregamento aparece ao inicializar
- [ ] É possível fazer "pull to refresh" (puxar para atualizar)

**Como testar:**
1. Após a splash screen, você deve ver a aba "Filmes" ativa
2. Role a lista para ver todos os 6 filmes mockados
3. Toque em um filme para navegar para a tela de detalhes
4. Volte usando o botão de voltar
5. Puxe a lista para baixo para recarregar (pull to refresh)

---

### ⭐ Funcionalidade: Favoritos

**O que verificar:**
- [ ] É possível adicionar filme aos favoritos clicando no botão
- [ ] O botão muda de "🤍 Adicionar aos Favoritos" para "❤️ Favorito"
- [ ] É possível remover filme dos favoritos
- [ ] Os favoritos persistem ao navegar entre telas

**Como testar:**
1. Na lista de filmes, clique em "🤍 Adicionar aos Favoritos" em um filme
2. Verifique se o botão mudou para "❤️ Favorito"
3. Navegue para outra tela e volte
4. Verifique se o filme ainda está marcado como favorito
5. Clique novamente para remover dos favoritos

---

### 📋 Tela 3: Detalhes do Filme

**O que verificar:**
- [ ] A tela de detalhes abre ao clicar em um filme
- [ ] Mostra todas as informações do filme:
  - [ ] Título
  - [ ] Gênero
  - [ ] Sinopse completa
  - [ ] Data de lançamento
  - [ ] Classificação (⭐)
  - [ ] Imagem do filme
- [ ] O botão de favorito funciona nesta tela também
- [ ] É possível voltar para a lista de filmes

**Como testar:**
1. Clique em qualquer filme da lista
2. Verifique se todas as informações estão corretas
3. Teste adicionar/remover favorito nesta tela
4. Volte usando o botão de voltar ou gesto de swipe

---

### ❤️ Tela 4: Favoritos (Tab "Favoritos")

**O que verificar:**
- [ ] A aba "Favoritos" aparece na barra inferior
- [ ] Lista apenas os filmes marcados como favoritos
- [ ] A lista está vazia se não houver favoritos
- [ ] É possível navegar para detalhes a partir desta tela
- [ ] É possível remover favoritos desta tela

**Como testar:**
1. Adicione alguns filmes aos favoritos na lista principal
2. Navegue para a aba "Favoritos"
3. Verifique se os filmes adicionados aparecem
4. Clique em um filme para ver detalhes
5. Remova um favorito e verifique se ele some da lista

---

### ℹ️ Tela 5: Sobre (Tab "Sobre")

**O que verificar:**
- [ ] A aba "Sobre" aparece na barra inferior
- [ ] A tela exibe informações sobre o aplicativo
- [ ] Não há erros ao navegar para esta tela

**Como testar:**
1. Clique na aba "Sobre"
2. Verifique se as informações são exibidas corretamente

---

### 🗄️ Banco de Dados SQLite

**O que verificar:**
- [ ] O banco de dados é inicializado sem erros
- [ ] As tabelas são criadas corretamente:
  - [ ] Tabela `filmes`
  - [ ] Tabela `clientes`
  - [ ] Tabela `locacoes`

**Como testar via console:**
1. Abra o menu de desenvolvimento (agite o celular ou `m` no terminal)
2. Verifique o console do Metro bundler no terminal
3. Deve aparecer: "Banco de dados inicializado com sucesso"
4. Não deve haver erros relacionados ao SQLite

**Para testar operações de banco (se houver telas para isso):**
- [ ] Se houver tela para adicionar filmes ao banco, teste criar um novo
- [ ] Teste listar filmes do banco
- [ ] Teste atualizar disponibilidade de filmes
- [ ] Teste registrar locações (se houver essa funcionalidade)

---

### 🧭 Navegação

**O que verificar:**
- [ ] A navegação entre tabs funciona corretamente
- [ ] A navegação entre telas do stack (lista → detalhes) funciona
- [ ] O botão voltar funciona corretamente
- [ ] Os ícones das tabs aparecem corretamente
- [ ] A cor ativa das tabs está visível (#e91e63)

**Como testar:**
1. Navegue entre todas as tabs (Filmes, Favoritos, Sobre)
2. Verifique se os ícones mudam quando a tab está ativa
3. Navegue para detalhes e volte
4. Teste usar gesto de swipe para voltar (iOS/Android)

---

### 🎨 Interface e Estilo

**O que verificar:**
- [ ] O layout está responsivo e não quebra
- [ ] As cores estão corretas (cor principal: #e91e63)
- [ ] Os textos estão legíveis
- [ ] As imagens dos filmes carregam (ou mostram placeholder)
- [ ] Não há elementos sobrepostos
- [ ] A barra de status está visível

---

## 🔍 Testes de Erro e Edge Cases

### Teste 1: Recarregar o App
- [ ] Feche completamente o app
- [ ] Abra novamente
- [ ] Verifique se os favoritos ainda estão salvos (se estiver usando AsyncStorage)
- [ ] Verifique se o banco de dados ainda funciona

### Teste 2: Conectividade
- [ ] Desligue o Wi-Fi temporariamente
- [ ] Verifique se o app continua funcionando (é um app offline)

### Teste 3: Performance
- [ ] Role a lista de filmes rapidamente
- [ ] Verifique se não há travamentos ou lags
- [ ] Navegue entre telas rapidamente

---

## 📊 Resumo dos Testes

Após executar todos os testes acima, você deve ter verificado:

✅ **Funcionalidades Core:**
- Splash Screen
- Lista de Filmes
- Detalhes do Filme
- Sistema de Favoritos
- Navegação entre telas

✅ **Banco de Dados:**
- Inicialização do SQLite
- Criação de tabelas
- (Funcionalidades específicas se houver)

✅ **Interface:**
- Layout responsivo
- Navegação fluida
- Estilo consistente

---

## 🐛 Como Reportar Problemas

Se encontrar algum erro:

1. **Anote o erro exato** que aparece na tela ou no console
2. **Tire um screenshot** se possível
3. **Verifique o console do Metro bundler** no terminal
4. **Descreva os passos** que levaram ao erro

### Console do Metro Bundler
O console mostra:
- ✅ Mensagens de sucesso (verde)
- ⚠️ Avisos (amarelo)
- ❌ Erros (vermelho)

---

## 🎯 Teste Rápido (5 minutos)

Se você tem pouco tempo, teste pelo menos:

1. ✅ App inicia sem erros
2. ✅ Lista de filmes aparece
3. ✅ É possível clicar em um filme e ver detalhes
4. ✅ É possível adicionar filme aos favoritos
5. ✅ Navegação entre tabs funciona
6. ✅ Banco de dados inicializa sem erros (ver console)

Se todos esses passarem, o app está funcionando! 🎉

---

## 💡 Dicas de Teste

- **Mantenha o terminal aberto** para ver logs em tempo real
- **Use o modo de desenvolvimento** (agite o celular) para ver erros
- **Teste em diferentes orientações** (retrato/paisagem) se relevante
- **Teste com diferentes tamanhos de tela** se possível

---

## ✨ Boa Sorte nos Testes!

Se encontrar algum problema, verifique:
- Se todas as dependências foram instaladas (`npm install`)
- Se o servidor Expo está rodando
- Se o celular e PC estão na mesma rede Wi-Fi (para Expo Go)

