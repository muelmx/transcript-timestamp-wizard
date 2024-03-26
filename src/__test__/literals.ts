export const TestData = {
  input: `00:00:02:17 - 00:00:23:03
Sprecher 1
Ja, da möchte ich mich erst mal ganz herzlich bei Ihnen bedanken, dass Sie sich die Zeit nehmen wollte, mit mir über das Thema Digitalisierung zu sprechen. Wir werden mit verschiedenen Themenbereiche abgreifen. Wir werden über das Thema digitale Infrastruktur, den Einsatz von digitalen Medien und das Medium bezogene professionell Wissen sprechen und eben den Medien Einsatz speziell in Bezug auf ihre Schülerinnen schaft.

00:00:24:00 - 00:00:30:11
Sprecher 1
Und das ist der Anfang. Möchte ich etwas über Sie erfahren. Wer sind Sie und welche Funktion haben Sie an Ihrer Schule?`,

  outputWithoutSpeakers: `[00:00:02.17] Ja, da möchte ich mich erst mal ganz herzlich bei Ihnen bedanken, dass Sie sich die Zeit nehmen wollte, mit mir über das Thema Digitalisierung zu sprechen. Wir werden mit verschiedenen Themenbereiche abgreifen. Wir werden über das Thema digitale Infrastruktur, den Einsatz von digitalen Medien und das Medium bezogene professionell Wissen sprechen und eben den Medien Einsatz speziell in Bezug auf ihre Schülerinnen schaft.

[00:00:24.00] Und das ist der Anfang. Möchte ich etwas über Sie erfahren. Wer sind Sie und welche Funktion haben Sie an Ihrer Schule?`,

  outputWithSpeakers: `[00:00:02.17] Sprecher 1: Ja, da möchte ich mich erst mal ganz herzlich bei Ihnen bedanken, dass Sie sich die Zeit nehmen wollte, mit mir über das Thema Digitalisierung zu sprechen. Wir werden mit verschiedenen Themenbereiche abgreifen. Wir werden über das Thema digitale Infrastruktur, den Einsatz von digitalen Medien und das Medium bezogene professionell Wissen sprechen und eben den Medien Einsatz speziell in Bezug auf ihre Schülerinnen schaft.

[00:00:24.00] Sprecher 1: Und das ist der Anfang. Möchte ich etwas über Sie erfahren. Wer sind Sie und welche Funktion haben Sie an Ihrer Schule?`,
};
