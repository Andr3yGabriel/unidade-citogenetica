<script lang="ts" setup>
import { useRouter } from 'vue-router';
import AppFooter from '../components/AppFooter.vue';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const router = useRouter();
const loginPage = () => router.push('/Login');
</script>

<template>
  <div class="page-container">

    <!-- HEADER -->
    <header id="header-home">
      <section class="header-text">
        <h1>UNIDADE DE GENÉTICA</h1>
        <h2>UGEN - DF</h2>
      </section>
      <img src="../assets/logogdf_1.svg" alt="Logo do GDF, fundo azul e ipê amarelo" />
    </header>

    <!-- NAV -->
    <nav>
      <a class="a-menu" href="#home-main">SOBRE</a>
      <a class="a-menu" href="#pag-unidades">UNIDADES</a>
      <a class="a-menu" href="#pag-perguntas">PERGUNTAS FREQUENTES</a>
      <a class="a-menu" href="#pag-contatos">CONTATOS</a>
      <a class="a-menu btn-login" @click="loginPage">LOGIN</a>
    </nav>

    <!-- MAIN: SOBRE -->
    <main id="home-main">
      <h2>Conheça a Unidade de Genética</h2>

      <article>
        <p>
          Obedecendo à Diretriz de Atenção Integral aos pacientes com Doenças Raras
          preconizada pela <strong>Portaria 199 do Ministério da Saúde</strong>, a Unidade de Genética do
          Hospital de Apoio presta atendimento para pacientes com doenças genéticas,
          hereditárias ou raras — o que inclui as malformações congênitas, deficiência
          intelectual, distúrbios de comportamento, erros inatos do metabolismo, distúrbios de
          diferenciação sexual, baixa estatura, doenças neurodegenerativas, além de câncer
          familiar e infertilidade conjugal.
        </p>
        <br />
        <p>
          Para o atendimento dessas doenças é necessária a atuação de uma equipe
          multidisciplinar. Por ser o <strong>Centro de Referência de Doenças Raras</strong>, a Unidade de
          Genética atende a demanda de pacientes procedentes do Distrito Federal, entorno e
          até de outros estados. Além disso, o serviço de genética atende os pacientes com
          alteração na triagem neonatal (teste do pezinho).
        </p>
      </article>

      <div id="container">
        <div class="card-info">
          <img class="imagem-card" src="../assets/hospital.png" />
          <div class="text-card">
            <p>Estamos localizados no Hospital de Apoio, Noroeste.</p>
          </div>
        </div>

        <div class="card-info">
          <img class="imagem-card" src="../assets/doencas-raras.png" />
          <div class="text-card">
            <p>Somos referência em diagnóstico de Doenças Raras.</p>
          </div>
        </div>

        <div class="card-info">
          <img class="imagem-card" src="../assets/exame.png" />
          <div class="text-card">
            <p>
              Exame de citogenética em parceria com a Secretaria de Saúde do DF.
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- UNIDADES -->
    <section id="pag-unidades">
      <h2>Unidades</h2>

      <div id="container-unidades">
        <!-- UNIDADE 1: Genética Clínica (era a 2ª) -->
        <div class="card-unidades">
          <div class="card-img-wrap">
            <img class="logo-unidade" src="../assets/genetica-clinica.jpeg" />
          </div>
          <div class="coluna-texto-unidade">
            <p>
              A Unidade de Genética do Hospital de Apoio segue a Portaria 199 do
              Ministério da Saúde, oferecendo atendimento a pacientes com doenças
              genéticas, hereditárias ou raras, como malformações congênitas,
              deficiência intelectual, distúrbios de comportamento, erros do
              metabolismo, distúrbios de diferenciação sexual, baixa estatura,
              doenças neurodegenerativas, câncer familiar e infertilidade
              conjugal.
            </p>
          </div>
        </div>

        <!-- UNIDADE 2: Triagem Neonatal -->
        <div class="card-unidades">
          <div class="coluna-texto-unidade">
            <p>
              O Laboratório de Triagem Neonatal realiza o teste do pezinho no
              Distrito Federal para identificar precocemente doenças graves em
              recém-nascidos. O objetivo é detectar essas condições antes que se
              tornem sintomáticas, permitindo tratamento oportuno que pode
              prevenir sequelas e até mesmo a morte.
            </p>
          </div>
          <div class="card-img-wrap">
            <img class="logo-unidade" src="../assets/teste-pezinho.jpeg" />
          </div>
        </div>

        <!-- UNIDADE 3: Citogenética -->
        <div class="card-unidades">
          <div class="card-img-wrap">
            <img class="logo-unidade" src="../assets/laboratorio-citogenetica.png" />
          </div>
          <div class="coluna-texto-unidade">
            <p>
              O Laboratório de Citogenética apoia o diagnóstico de Doenças Raras e
              Hematologia na Secretaria de Saúde do Distrito Federal, realizando
              análises de cariótipos para diversas equipes médicas e de
              hematologia. Em breve, começará a realizar exames FISH para detectar
              anomalias cromossômicas mais complexas que a citogenética clássica
              não consegue identificar.
            </p>
          </div>
        </div>

        <!-- UNIDADE 4: Biologia Molecular -->
        <div class="card-unidades">
          <div class="coluna-texto-unidade">
            <p>
              O Laboratório de Biologia Molecular da UGEN/HAB é o único da SES/DF
              que realiza e emite laudos para exames moleculares. Ele apoia a Rede
              de Genética Clínica do DF, o Teste do Pezinho ampliado, e o Serviço
              de Oncologia, e faz triagens para várias condições genéticas e
              câncer hereditário, conforme leis distritais e nacionais.
            </p>
          </div>
          <div class="card-img-wrap">
            <img class="logo-unidade" src="../assets/biologia-molecular.jpeg" />
          </div>
        </div>
      </div>
    </section>

    <!-- COMO CHEGAR -->
    <section id="pag-como-chegar">
      <h1>Como Chegar?</h1>

      <div class="como-chegar-inner">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.8597016877234!2d-47.91793562487062!3d-15.75855948487688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3a05913e99cd%3A0x170d1b94bead74ee!2sHospital%20de%20Apoio%20de%20Bras%C3%ADlia!5e0!3m2!1spt-BR!2sbr!4v1724723551639!5m2!1spt-BR!2sbr"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <div class="endereco-card">
          <div class="endereco-icone">
            <ion-icon name="location-outline"></ion-icon>
          </div>
          <div class="endereco-texto">
            <p class="endereco-titulo">Endereço</p>
            <p class="endereco-principal">AENW 03, Lote A<br />Setor Noroeste, Brasília - DF</p>
            <p class="endereco-detalhe">Próximo ao Hospital da Criança</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PERGUNTAS FREQUENTES -->
    <section id="pag-perguntas">
      <h1>Perguntas Frequentes</h1>

      <div class="accordion-wrap">
        <Accordion value="0">
          <AccordionPanel value="0">
            <AccordionHeader>1. Como agendar consulta para Genética Médica?</AccordionHeader>
            <AccordionContent>
              <p>
                A consulta é agendada pela Central de Regulação. Precisa ter
                solicitação médica e ser inserida na regulação em uma unidade básica
                de saúde mais próxima de sua residência.
              </p>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="1">
            <AccordionHeader>2. Como marcar o retorno da consulta?</AccordionHeader>
            <AccordionContent>
              <p>
                Mandar mensagem de WhatsApp, com nome do paciente, SES e nome do
                profissional, para o telefone: <strong>(61) 9172-1842</strong> e aguardar retorno.
              </p>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="2">
            <AccordionHeader>3. Como pegar o resultado do cariótipo, X-frágil e MLPA?</AccordionHeader>
            <AccordionContent>
              <p>
                Os exames da Genética são confidenciais, por isso os resultados são
                entregues pelo médico no momento da consulta de retorno e do
                aconselhamento genético.
              </p>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel value="3">
            <AccordionHeader>4. Como pegar o resultado do teste do pezinho?</AccordionHeader>
            <AccordionContent>
              <p>
                Pelo site da Secretaria de Saúde — Saúde da Criança — Teste do Pezinho.
              </p>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </section>

    <!-- CONTATOS -->
    <section id="pag-contatos">
      <div class="container-contatos">
        <article id="art-contatos">
          <h1>Dúvidas?</h1>
          <p>Entre em contato conosco.</p>
        </article>

        <div class="contatos-lista">
          <div class="contato-item">
            <span class="contato-icone"><ion-icon name="logo-whatsapp"></ion-icon></span>
            <div>
              <p class="contato-label">WhatsApp (apenas mensagens)</p>
              <p class="contato-valor">(61) 9172-1842</p>
            </div>
          </div>

          <div class="divisor">ou</div>

          <div class="contato-item">
            <span class="contato-icone"><ion-icon name="call-outline"></ion-icon></span>
            <div>
              <p class="contato-label">Telefone — Hospital de Apoio (Genética)</p>
              <p class="contato-valor">(61) 3449-7555 / 3449-7556</p>
            </div>
          </div>

          <div class="divisor">ou</div>

          <div class="contato-item">
            <span class="contato-icone"><ion-icon name="location-outline"></ion-icon></span>
            <div>
              <p class="contato-label">Endereço</p>
              <p class="contato-valor">AENW 03, Lote A, Setor Noroeste, Brasília-DF</p>
              <p class="contato-obs">Próximo ao Hospital da Criança</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RODAPÉ DE LOGOS -->
    <section class="logo-rodape">
      <img src="../assets/logo-unidade.jpg" alt="Logo da Unidade de Genética" />
      <img src="../assets/logo-gdf.png" alt="Logo do GDF" />
      <img src="../assets/logo-sus.png" alt="Logo do SES" />
    </section>

    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

/* ==============================
   RESET / BASE
============================== */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ==============================
   HEADER
============================== */
#header-home {
  display: flex;
  justify-content: space-between;
  padding: 24px 40px;
  align-items: center;
  background: linear-gradient(135deg, #2a6fa8 0%, #488bbf 60%, #5ba3d4 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);

  img {
    height: 140px;
    width: 220px;
    object-fit: contain;
  }

  .header-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  h1 {
    font-weight: 700;
    font-size: 2.4rem;
    color: #fff;
    letter-spacing: 0.04em;
    line-height: 1.1;
  }

  h2 {
    font-weight: 300;
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.12em;
  }
}

/* ==============================
   NAV
============================== */
nav {
  display: flex;
  background-color: $primary-color;
  padding: 0 40px;
  justify-content: center;
  align-items: center;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.a-menu {
  margin: 0 36px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.2s, border-bottom 0.2s;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  cursor: pointer;

  &:hover {
    color: #fff;
    border-bottom: 2px solid rgba(255, 255, 255, 0.7);
  }

  &.btn-login {
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 20px;
    padding: 6px 20px;
    margin-left: 20px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.28);
      border-bottom: 2px solid transparent;
    }
  }
}

/* ==============================
   MAIN: SOBRE
============================== */
main {
  flex-grow: 1;
}

#home-main {
  display: flex;
  width: 100%;
  background-color: #f8fbff;
  padding: 60px 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h2 {
    text-align: center;
    font-weight: 600;
    font-size: 2.2rem;
    color: #1a4e7a;
    margin-bottom: 16px;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 3px;
      background-color: #488bbf;
      margin: 14px auto 0;
      border-radius: 2px;
    }
  }

  article {
    max-width: 860px;
    padding: 32px 20px 0;

    p {
      font-size: 1.07rem;
      color: #333;
      text-align: justify;
      font-weight: 400;
      line-height: 1.75;
    }
  }
}

/* Cards de destaque */
#container {
  display: flex;
  margin-top: 48px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 28px;
  padding: 0 20px;

  .card-info {
    background-color: $primary-color;
    width: 300px;
    border-radius: 16px;
    box-shadow: 0 4px 18px rgba(72, 139, 191, 0.25);
    transition: transform 0.25s, box-shadow 0.25s;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(72, 139, 191, 0.35);
    }

    .imagem-card {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .text-card {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 20px 16px;
      color: #fff;
      font-size: 1.05rem;
      font-weight: 400;
      line-height: 1.5;
    }
  }
}

/* ==============================
   UNIDADES
============================== */
#pag-unidades {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: $primary-color;
  padding: 60px 20px 80px;

  h2 {
    color: #fff;
    font-weight: 600;
    font-size: 2.2rem;
    margin-bottom: 8px;
    letter-spacing: 0.02em;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 50px;
      height: 3px;
      background-color: rgba(255, 255, 255, 0.6);
      margin: 12px auto 0;
      border-radius: 2px;
    }
  }

  #container-unidades {
    display: flex;
    max-width: 900px;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    margin-top: 40px;
    gap: 20px;

    .card-unidades {
      display: flex;
      background-color: #fff;
      align-items: center;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transition: box-shadow 0.25s;

      &:hover {
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
      }

      .card-img-wrap {
        flex-shrink: 0;
      }

      .logo-unidade {
        width: 280px;
        height: 280px;
        object-fit: cover;
        object-position: center;
        display: block;
      }

      .coluna-texto-unidade {
        flex: 1;
        p {
          text-align: justify;
          padding: 28px 32px;
          font-size: 1.02rem;
          color: #333;
          line-height: 1.7;
        }
      }
    }
  }
}

/* ==============================
   COMO CHEGAR
============================== */
#pag-como-chegar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  background-color: #f8fbff;

  h1 {
    color: #1a4e7a;
    font-weight: 600;
    font-size: 2.2rem;
    margin-bottom: 40px;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 50px;
      height: 3px;
      background-color: #488bbf;
      margin: 12px auto 0;
      border-radius: 2px;
    }
  }

  .como-chegar-inner {
    display: flex;
    align-items: stretch;
    gap: 32px;
    width: 100%;
    max-width: 1000px;
  }

  iframe {
    flex: 1;
    min-width: 0;
    height: 380px;
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  .endereco-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    background-color: #fff;
    border: 1px solid #ddeaf8;
    border-radius: 16px;
    padding: 36px 28px;
    box-shadow: 0 4px 16px rgba(72, 139, 191, 0.12);
    min-width: 240px;
    max-width: 280px;
  }

  .endereco-icone {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background-color: #e3efff;
    border-radius: 14px;
    color: #2a6fa8;
    font-size: 1.6rem;
  }

  .endereco-titulo {
    font-size: 0.8rem;
    font-weight: 600;
    color: #8eaac8;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0;
  }

  .endereco-principal {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1a4e7a;
    line-height: 1.5;
    margin: 4px 0 0;
  }

  .endereco-detalhe {
    font-size: 0.9rem;
    color: #7a9ab8;
    margin: 4px 0 0;
  }
}

/* ==============================
   PERGUNTAS FREQUENTES
============================== */
#pag-perguntas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: $primary-color;
  padding: 60px 20px 72px;

  h1 {
    font-size: 2.2rem;
    color: #fff;
    font-weight: 600;
    margin-bottom: 36px;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 50px;
      height: 3px;
      background-color: rgba(255, 255, 255, 0.6);
      margin: 12px auto 0;
      border-radius: 2px;
    }
  }

  .accordion-wrap {
    width: 100%;
    max-width: 860px;

    p {
      font-size: 1.05rem;
      line-height: 1.65;
      color: #333;
    }
  }
}

/* ==============================
   CONTATOS
============================== */
#pag-contatos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: #f8fbff;

  .container-contatos {
    background-color: #fff;
    width: 100%;
    max-width: 700px;
    border-radius: 20px;
    box-shadow: 0 6px 28px rgba(72, 139, 191, 0.15);
    padding: 48px 40px;
    border: 1px solid #e0ecf8;
  }

  #art-contatos {
    text-align: center;
    margin-bottom: 36px;

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a4e7a;
      margin-bottom: 6px;
    }

    p {
      font-size: 1.1rem;
      color: #555;
    }
  }

  .contatos-lista {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .contato-item {
    display: flex;
    align-items: flex-start;
    gap: 18px;
    padding: 20px 0;
    border-bottom: 1px solid #edf2f8;

    &:last-child {
      border-bottom: none;
    }
  }

  .contato-icone {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e3efff;
    color: #2a6fa8;
    font-size: 1.5rem;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    flex-shrink: 0;
  }

  .contato-label {
    font-size: 0.85rem;
    color: #888;
    font-weight: 500;
    letter-spacing: 0.03em;
    margin: 0 0 4px;
  }

  .contato-valor {
    font-size: 1.05rem;
    color: #1a4e7a;
    font-weight: 600;
    margin: 0;
  }

  .contato-obs {
    font-size: 0.88rem;
    color: #888;
    margin: 2px 0 0;
  }

  .divisor {
    text-align: center;
    color: #aac4e0;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 4px 0;
  }
}

/* ==============================
   RODAPÉ DE LOGOS
============================== */
.logo-rodape {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 32px 20px;
  background-color: #fff;
  border-top: 1px solid #e5edf5;

  img {
    max-height: 90px;
    max-width: 160px;
    object-fit: contain;
    filter: grayscale(15%);
    opacity: 0.88;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }
}

/* ==============================
   RESPONSIVO
============================== */
@media (max-width: 1024px) {
  #header-home {
    flex-direction: column;
    text-align: center;
    padding: 24px 16px;
    gap: 16px;

    img {
      height: 110px;
      width: auto;
    }

    h1 { font-size: 1.8rem; }
    h2 { font-size: 1.2rem; }
  }

  nav {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 16px;
    gap: 8px;
  }

  .a-menu {
    margin: 4px 12px;
    font-size: 0.78rem;
  }

  #home-main {
    padding: 40px 16px;

    h2 { font-size: 1.8rem; }

    article {
      padding: 20px 0 0;
    }
  }

  #container {
    gap: 16px;

    .card-info {
      width: 280px;
    }
  }

  #pag-unidades {
    #container-unidades {
      max-width: 100%;

      .card-unidades {
        flex-direction: column;

        .logo-unidade {
          width: 100%;
          height: 220px;
          object-fit: cover;
          object-position: center top;
        }

        .coluna-texto-unidade p {
          padding: 20px;
        }
      }
    }
  }

  #pag-como-chegar {
    .como-chegar-inner {
      flex-direction: column;
    }

    iframe {
      width: 100%;
      height: 300px;
    }

    .endereco-card {
      max-width: 100%;
      min-width: unset;
      flex-direction: row;
      align-items: center;
      padding: 24px 20px;
    }
  }

  #pag-perguntas {
    padding: 48px 16px 56px;
  }

  #pag-contatos {
    .container-contatos {
      padding: 32px 20px;
    }
  }

  .logo-rodape {
    flex-wrap: wrap;
    gap: 24px;
  }
}

@media (max-width: 600px) {
  #header-home h1 { font-size: 1.4rem; }
  #header-home h2 { font-size: 1rem; }

  .a-menu { font-size: 0.72rem; margin: 4px 8px; }

  #home-main h2,
  #pag-unidades h2,
  #pag-como-chegar h1,
  #pag-perguntas h1 {
    font-size: 1.6rem;
  }

  #container .card-info {
    width: 100%;
    max-width: 340px;
  }
}
</style>