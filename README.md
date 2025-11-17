# Site do Casamento — RSVP

Esta é uma landing page simples para confirmação de presença (RSVP) do casamento. Contém: contagem regressiva, informações do dia, local, formulário de confirmação (salva localmente) e um pequeno painel admin para exportar respostas.

Arquivos principais
- `index.html` — página principal (texto, data/hora, endereço, formulário RSVP).
- `styles.css` — estilos e responsividade.
- `script.js` — lógica da contagem regressiva, gravação de RSVP em `localStorage`, botão `mailto:` e painel admin (export CSV / limpar).

Como personalizar
- Data e hora: edite o atributo `data-datetime` no elemento `#wedding-date` dentro de `index.html`. Use formato ISO 8601, por exemplo:

```powershell
<!-- Exemplo dentro de index.html -->
<p id="wedding-date" data-datetime="2026-11-22T08:00:00">22 de Novembro de 2026 — 08:00</p>
```

- Texto visível (data/horário): atualize também os elementos visíveis `#info-date` e `#info-time` em `index.html` se quiser um formato diferente.
- Endereço do local: edite a seção `Local` em `index.html` (atualmente: Paróquia Santíssima Trindade — Rua Tuim 33, Arapongas, PR, 86709-380).
- E-mail para receber RSVPs via botão (mailto): em `script.js`, altere a constante `HOST_EMAIL`.
- Cores e tipografia: edite `styles.css` (variáveis em `:root` para paleta rápida).

Armazenamento de respostas
- As respostas são salvas localmente no navegador (localStorage) sob a chave `casamento_rsvps_v1`.
- Para ver respostas salvas no navegador, abra o Console do navegador (DevTools) e execute:

```javascript
JSON.parse(localStorage.getItem('casamento_rsvps_v1') || '[]')
```

Painel admin
- Para visualizar o painel admin (lista de RSVPs e botões Exportar CSV / Limpar), abra a página com `?admin=1` na URL. Exemplo (se estiver rodando localmente):

```
http://localhost:8000/index.html?admin=1
```

Executar localmente (Windows PowerShell)
- Abrir diretamente no navegador:

```powershell
Start-Process 'c:\Users\karin\OneDrive\Anexos\Desktop\Casamento\index.html'
```

- Ou rodar um servidor HTTP simples (recomendado) para testes locais:

```powershell
cd 'c:\Users\karin\OneDrive\Anexos\Desktop\Casamento'
python -m http.server 8000
# então abra http://localhost:8000
```

Publicar no GitHub Pages
1. Crie um repositório no GitHub (ex.: `casamento`).
2. No PowerShell, dentro da pasta do projeto, rode:

```powershell
cd 'c:\Users\karin\OneDrive\Anexos\Desktop\Casamento'
git init
git add .
git commit -m "Publicar site do casamento"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git push -u origin main
```
3. No GitHub: vá em Settings → Pages → escolha a branch `main` e root `/`, salve. Aguarde alguns minutos para o link público aparecer (ex.: `https://SEU_USUARIO.github.io/NOME_DO_REPO/`).

Alternativa rápida: Netlify Drop
- Para um link público imediato, acesse https://app.netlify.com/drop e arraste a pasta `Casamento` (ou o `Casamento.zip`) — o Netlify irá gerar uma URL pública automaticamente.

Observações importantes
- As confirmações são salvas apenas no navegador por padrão (localStorage). Se quiser centralizar respostas (Google Sheets, Firebase, etc.), posso ajudar a integrar.
- Verifique o e-mail em `script.js` para garantir que o botão "Enviar por e-mail" mande para o endereço correto.
- Se for publicar em um domínio próprio, você pode configurar DNS no provedor escolhido (Netlify / GitHub Pages) para apontar para o site.

Licença
- Este projeto é fornecido sem licença específica — sinta-se livre para editar e usar conforme necessário. Se quiser, adiciono uma licença (MIT/Apache) ao repositório.

---

Se quiser, eu posso: gerar automaticamente o repositório no GitHub usando o GitHub CLI (`gh`), executar os comandos git locais por você agora, ou guiar passo a passo o deploy. Diga qual opção prefere.