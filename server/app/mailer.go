package app

import (
	"fmt"
	"net/mail"
	"net/smtp"
)

func (h *Handlers) SendInvitationEmail(to, code string) error {
	host := h.cfg.SMTPHost
	port := h.cfg.SMTPPort
	user := h.cfg.SMTPUser
	pass := h.cfg.SMTPPass
	from := h.cfg.SMTPFrom
	appURL := h.cfg.AppURL

	subject := "Te han invitado a unirte a un hogar en Keda"
	body := fmt.Sprintf("Hola!\n\nTe han invitado a compartir los gastos de un hogar en Keda.\n\nPara unirte, haz click en el siguiente enlace o usa el código de invitación al loguearte: %s\n\nLink: %s/invite?code=%s\n\n¡Te esperamos!", code, appURL, code)

	toAddr := mail.Address{Address: to}
	message := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: text/plain; charset=\"utf-8\"\r\n"+
		"\r\n"+
		"%s\r\n", toAddr.String(), subject, body))

	auth := smtp.PlainAuth("", user, pass, host)

	if user == "" && pass == "" {
		auth = nil // For local development with Mailpit if no auth is set
	}

	addr := fmt.Sprintf("%s:%s", host, port)
	err := smtp.SendMail(addr, auth, from, []string{to}, message)
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}

	return nil
}
