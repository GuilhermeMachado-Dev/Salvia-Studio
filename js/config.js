/* =====================================================================
   Sálvia Studio · CONFIGURAÇÃO (projeto de portfólio)
   É aqui que se troca o WhatsApp, a mensagem dos botões e a conversa
   de exemplo. Não precisa mexer em script.js para isso.
   Como a marca é fictícia, os botões levam ao WhatsApp de quem fez o site.
   ===================================================================== */
const CONFIG = {
  whatsapp: "5517996290224",
  mensagem: servico => servico
    ? `Olá! Vi o projeto Sálvia Studio no seu portfólio (botão: ${servico}) e quero um site assim.`
    : "Olá! Vi o projeto Sálvia Studio no seu portfólio e quero um site assim.",
  // conversa de exemplo (eu = cliente, ela = estúdio, aviso = selo final)
  conversa: [
    ["eu",    "Oi! Queria agendar uma massagem relaxante. Tem horário na quinta?"],
    ["ela",   "Olá! Na quinta temos às 15h ou às 18h. Qual fica melhor?"],
    ["eu",    "Às 18h, por favor."],
    ["ela",   "Perfeito! A massagem relaxante tem 50 min e custa R$ 130,00."],
    ["ela",   "Para confirmar, pedimos o sinal de 50%: R$ 65,00."],
    ["eu",    "Sinal enviado!"],
    ["ela",   "Recebido. Seu horário está confirmado para quinta às 18h."],
    ["aviso", "Horário confirmado"]
  ]
};
