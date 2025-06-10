<script lang="ts" setup>
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import router from '../router/router';

const loginPage = () => {
  router.push('Login');
}
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "LandingPage"
})
</script>

<template>
  <header id="header-home">
    <section>
      <h1>UNIDADE DE GENÉTICA</h1>
      <h2>UGEN - DF</h2>
    </section>

    <img
      src="../assets/logogdf_1.svg"
      alt="Logo do GDF, fundo azul e ipê amarelo"
    />
  </header>
  <nav>
    <a class="a-menu" href="#home-main">SOBRE</a>
    <a class="a-menu" href="#pag-unidades">UNIDADES</a>
    <a class="a-menu" href="#pag-perguntas">PERGUNTAS FREQUENTES</a>
    <a class="a-menu" href="#pag-duvidas">CONTATOS</a>
    <a class="a-menu" @click="loginPage">LOGIN</a>
  </nav>

  <main id="home-main">
    <h2>Conheça a Unidade Genética</h2>

    <article>
      <p>
        O Laboratório de Citogenética é especializado no estudo dos cromossomos,
        abrangendo sua estrutura, função, comportamento e patologias associadas.
        Esta área científica emergiu da integração da citologia, que analisa a
        célula, com a genética, que investiga a hereditariedade e a variação
        genética.
      </p>
      <br />

      <p>
        A principal missão do laboratório é aprofundar o conhecimento sobre a
        célula, possibilitando avanços significativos na compreensão de doenças
        genéticas e suas implicações. Para atingir esses objetivos, o
        laboratório foi projetado para incorporar três unidades funcionais
        distintas e um ambulatório, permitindo um fluxo de trabalho integrado e
        eficiente. Entre suas funções estão:
      </p>
      <br />

      <ul>
        <li>
          <strong>Armazenamento e análise de exames de pacientes:</strong>
          Manter registros detalhados e organizados para consultas e estudos
          futuros.
        </li>
        <li>
          <strong>Viabilização da visualização dos exames:</strong> Utilizar
          tecnologias avançadas para a análise precisa dos cromossomos e suas
          alterações.
        </li>
        <li>
          <strong>Melhorar o acesso aos exames:</strong> Garantir que os
          resultados estejam prontamente disponíveis para médicos e pacientes,
          facilitando o diagnóstico e o tratamento.
        </li>
        <br />
      </ul>

      <p>
        Este enfoque integrado e estruturado visa aprimorar a pesquisa e o
        atendimento na área de citogenética, contribuindo para avanços na
        medicina e na ciência genética.
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

  <!--PARTE: UNIDADES-->
  <section id="pag-unidades">
    <h2>Unidades</h2>

    <div id="container-unidades">
      <!--<div class="separacao">-->
      <!--UNIDADE1-->
      <div class="card-unidades">
        <div>
          <img class="logo-unidade" src="../assets/teste-pezinho.jpeg" />
        </div>
        <div class="coluna-texto-unidade">
          <p>
            O Laboratório de Triagem Neonatal realiza o teste do pezinho no
            Distrito Federal para identificar precocemente doenças graves em
            recém-nascidos. O objetivo é detectar essas condições antes que se
            tornem sintomáticas, permitindo tratamento oportuno que pode
            prevenir sequelas e até mesmo a morte.
          </p>
        </div>
      </div>

      <!--UNIDADE2-->
      <div class="card-unidades">
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
        <div>
          <img class="logo-unidade" src="../assets/genetica-clinica.jpeg" />
        </div>
      </div>

      <!--UNIDADE3-->
      <div class="card-unidades">
        <div>
          <img
            class="logo-unidade"
            src="../assets/laboratorio-citogenetica.png"
          />
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

      <!--UNIDADE4-->
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
        <div>
          <img class="logo-unidade" src="../assets/biologia-molecular.jpeg" />
        </div>
      </div>
    </div>
  </section>

  <!--PARTE: COMO CHEGAR-->

  <section id="pag-como-chegar">
    <h1>Como Chegar?</h1>
    <section id="info-loc">
      <!--imagem do boneco-->
      <img src="../assets/boneco-mapa.png" alt="Boneco segurando um mapa" />

      <!--endereço em texto-->
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.8597016877234!2d-47.91793562487062!3d-15.75855948487688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3a05913e99cd%3A0x170d1b94bead74ee!2sHospital%20de%20Apoio%20de%20Bras%C3%ADlia!5e0!3m2!1spt-BR!2sbr!4v1724723551639!5m2!1spt-BR!2sbr"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </section>
    <div class="texto-endereço">
      <p>
        AENW 3 Lote A Setor Noroeste, Brasília - DF<br />Ao lado do Hospital da
        Criança<br />Atendimento Laboratorial em Citogenética
      </p>
    </div>
  </section>

  <section id="pag-perguntas">
    <h1>Perguntas Frequentes</h1>

    <Accordion value="0">
      <AccordionPanel value="0" style="width: 1000px;">
        <AccordionHeader>1. Como agendar consulta para Genética Médica?</AccordionHeader>
        <AccordionContent>
          <p>
            A consulta é agendada pela Central de Regulação. Precisa ter
            solicitação médica e ser inserida na regulação em uma unidade básica
            de saúde mais próxima de sua residência.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1" style="width: 1000px;">
        <AccordionHeader>2. Como marcar o retorno da consulta?</AccordionHeader>
        <AccordionContent>
          <p>
            Mandar mensagem de WhatsApp, com nome do paciente, SES e nome do
            profissional, para o telefone: (61) 9172-1842 e aguardar retorno.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2" style="width: 1000px;">
        <AccordionHeader>3. Como pegar o resultado do cariótipo, x-frágil e MLPA?</AccordionHeader>
        <AccordionContent>
          <p>
            Os exames da Genética são confidenciais, por isso os resultados são
            entregues pelo médico, no momento da consilta de retorno e do
            aconselhamento genético.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="3" style="width: 1000px;">
        <AccordionHeader>4. Como pegar o resultado do teste do pezinho?</AccordionHeader>
        <AccordionContent>
          <p>
            Pelo site da Secretaria de Saúde - Saúde da Criança - Teste do
            pezinho.
          </p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </section>

  <section id="pag-contatos">
    <div class="container-contatos">
      <article id="art-contatos">
        <h1>Dúvidas?</h1>
        <p>Vamos te ajudar!</p>
        <p>Entre em contato conosco.</p>
      </article>

      <div class="contatos-botao">
        <div class="contato">
          <span><ion-icon name="logo-whatsapp"></ion-icon></span>
          <p>WhatsApp</p>
        </div>

        <p>Ou ligue</p>

        <div class="contato">
          <span><ion-icon name="call-outline"></ion-icon></span>
          <p>(61) 2017-1259</p>
        </div>
      </div>
    </div>
  </section>

  <section class="logo-rodape">
    <img src="../assets/logo-unidade.jpg" />
    <img src="../assets/laboratorio-citogenetica.png" />
    <img src="../assets/logo-gdf.png" />
    <img src="../assets/logo-sus.png" />
  </section>

  <footer>
    <p>
      Desenvolvido por
      <a href="https://github.com/Andr3yGabriel">Andrey Gonçalves</a> |
      <a href="https://github.com/javu4k">Júlia Peghini</a> |
      <a href="https://github.com/s4abr1na">Sabrina Souza </a> - 2024
    </p>
  </footer>
</template>

<style lang="scss">
#header-home {
  display: flex;
  justify-content: space-between;
  padding: 0px 30px;
  align-items: center;
  background-color: #fff;
  background-color: #488bbf;

  img {
    height: 160px;
    width: 250px;
  }

  h1 {
    font-weight: 500;
    font-size: 2.5rem;
    color: #fff;
  }

  h2 {
    font-weight: 500;
    font-size: 2.3rem;
    color: #fff;
  }
}

nav {
  display: flex;
  background-color: #0062ae;
  padding: 20px;
  justify-content: center;
  align-items: center;
}

.a-menu {
  margin: 0px 60px;
  font-size: 1.2em;
  color: #fff;
  text-decoration: none;
  font-weight: 300;
  transition: 0.2s;

  &:hover {
    color: #000;
  }
}

#home-main {
  display: flex;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h2 {
    text-align: center;
    font-weight: 500;
    font-size: 2.5rem;
    color: rgba(0, 0, 0, 0.63);
  }

  article {
    padding: 50px;

    p {
      font-size: 1.1rem;
      color: #000;
      text-align: justify;
      font-weight: 350;
    }
  }
}

ul {
  list-style-type: circle;
  padding: 20px 50px;
}

li {
  font-size: 1.1rem;
  color: #000;
  margin-bottom: 10px;
  text-align: justify;
}

#container {
  display: flex;
  margin-top: 15px;
  margin-bottom: 20px;
  width: fit-content;
  align-items: center;
  justify-content: space-around;

  .card-info {
    background-color: #0062ae;
    margin: 10px;
    width: 350px;
    height: 500px;
    border-radius: 25px;
    box-shadow: 0px 4px 8px #404040;
    transition: 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 50px;

    &:hover {
      box-shadow: 8px 16px 26px #ccc;
    }

    .imagem-card {
      width: 350px;
    }

    .text-card {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: justify;
      padding: 10px;
      height: 100px;
      color: #fff;
      font-size: 1.2rem;
      font-weight: 400;
    }
  }
}

#pag-unidades {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #0062ae;

  h2 {
    color: #fff;
    font-weight: 400;
    font-size: 2.7rem;
    margin: 80px 0px 40px 0px;
  }

  #container-unidades {
    display: flex;
    width: 850px;
    height: fit-content;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 40px 0px 80px 0px;

    .card-unidades {
      display: flex;
      background-color: #fff;
      align-items: center;
      justify-content: end;
      margin: 20px 20px;
      border-radius: 8px;

      .logo-unidade {
        width: 300px;
        height: 300px;
        padding: 20px;
      }

      .coluna-texto-unidade {
        p {
          text-align: justify;
          padding: 30px;
          font-size: 1.1rem;
          color: #000;
        }
      }
    }
  }
}

#pag-como-chegar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    color: rgba(0, 0, 0, 0.67);
    font-weight: 500;
    font-size: 2.2rem;
    margin: 40px;
  }

  iframe {
    width: 700px;
    height: 450px;
    border-radius: 15px;
  }

  #info-loc {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 90vw;
    justify-content: space-between;

    img {
      height: 400px;
      width: 500px;
    }

    h2 {
      background-color: #e6e6e6;
      font-weight: 400;
      text-align: center;
      padding: 10px;
      border-radius: 10px;
    }
  }

  .texto-endereço {
    background-color: #4685b6;
    margin: 50px;
    border-radius: 10px;

    p {
      color: #fff;
      padding: 30px;
      font-size: 1.1rem;
    }
  }
}

#pag-perguntas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0062ae;
  height: 700px;

  h1 {
    font-size: 2rem;
    color: #fff;
    font-weight: 450;
    margin-bottom: 40px;
  }

  p {
    font-size: 1.1rem;
  }
}

#pag-contatos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 20px 20px;

  .container-contatos {
    background-color: #e3efff;
    height: 100%;
    width: 80%;
    border-radius: 50px;
    color: #000;

    p {
      font-size: 1.7rem;
      font-weight: 400;
    }

    #art-contatos {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      p {
        font-size: 1.7rem;
        font-weight: 400;
        text-align: center;
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 450;
      }
    }

    .contatos-botao {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 30px;

      .contato {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 220px;
        background-color: #4175b9;
        border-radius: 30px;
        padding: 0 20px;
        position: relative;
        transition: 0.2s;

        &:hover {
          box-shadow: 2px 2px #aeaeae;
        }

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1.3rem;
          margin-right: 10px;
        }

        p {
          color: #fff;
          font-size: 1.3rem;
          margin: 0;
          text-align: center;
          flex: 1;
        }
      }
    }
  }
}

.logo-rodape {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;

  img {
    max-height: 100px;
    object-fit: contain;
  }
}

@media (max-width: 1024px) {
  #header-home {
    flex-direction: column;
    width: 100%;
    padding: 10px;

    img {
      height: 120px;
      width: 200px;
    }

    h1,
    h2 {
      font-size: 1.8rem;
      text-align: center;
    }
  }

  nav {
    flex-direction: column;
    width: 100%;
    padding: 10px;
  }

  .a-menu {
    margin: 10px 0px;
  }

  #home-main {
    padding: 10px;

    h2 {
      font-size: 2rem;
    }

    article {
      padding: 20px;
    }
  }

  ul {
    padding: 10px;
  }

  #container {
    flex-direction: column;
    margin: 0;

    .card {
      width: 300px;
      height: auto;
      margin: 10px;

      .imagem-card {
        width: 100%;
        max-width: 300px;
        height: auto;
        margin: 0 auto;
      }

      .main-card-content {
        width: 100%;
      }
    }
  }

  #pag-unidades {
    width: 100%;

    #container-unidades {
      width: 100%;

      .card-unidades {
        flex-direction: column;
        margin: 10px;

        .logo-unidade {
          width: 100%;
          max-width: 250px;
          height: auto;
        }

        .coluna-texto-unidade h2,
        p {
          padding: 10px;
          font-size: 1rem;  
          color: #000;
        }
      }
    }
  }

  #pag-como-chegar {
    justify-content: center;
    align-items: center;

    iframe {
      width: 100%;
      height: 300px;
    }
  }

  #info-loc {
    flex-direction: column;
    width: 100%;
    img {
      width: 100%;
      margin: 20px 0;
    }
  }

  .texto-endereço {
    width: 100%;
    margin: 20px 0;
  }

  #pag-perguntas,
  #pag-duvidas {
    padding: 10px;
    height: auto;
    width: 100%;

    .card-perguntas {
      width: 90%;
      max-width: 400px;
      margin: 10px auto;
      padding: 8px;
      height: auto;
    }

    .container-duvida {
      width: 100%;
      height: auto;
      padding: 20px;
    }
  }

  .contatos {
    width: 100%;
    margin: 20px 0;

    .contatos-botao {
      padding: 20px;
    }
  }

  .logo-rodape {
    padding: 10px;
    flex-direction: column;
  }

  footer {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
}
</style>
