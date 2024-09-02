import "../globals.css";

export default function About() {
  // yes, this is not very elegant, maybe refactor it later
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold my-4">About Me</h1>
      <p className="text-lg">
        Hello, my name is Junyi (Juni) Mei. I am currently an undergraduate
        student at Nankai University, pursuing double degree of Information
        Security and Law.
      </p>
      <p className="text-lg">
        🔭 I am interested in compiler techniques, programming languages,
        computer architecture, and machine learning.
      </p>
      <p className="text-lg">
        🌱 I am also an enthusiast of linguistics and philosophy.
      </p>
      <div>
        <h2 className="text-2xl font-semibold mt-6">Education</h2>
        <hr className="mb-3 mt-1" />
        <div>
          <h3 className="text-xl font-semibold">Nankai University</h3>
          <div className="flex justify-between">
            <div>Information Security and Law</div>
            <div className="text-right">
              <p>Tianjin, China&nbsp;&nbsp;&nbsp;2021.9 - 2025.8</p>
            </div>
          </div>
          <p className="font-semibold mt-2">Main Courses</p>
          <p className="text-base ml-4">
            Computer Architecture (92/100), Principles of Compiler (98/100),
            Operating System (93/100), Computer Networks (93/100), Database
            System (95/100), etc.
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mt-6">Honors and Awards</h2>
        <hr className="mb-3 mt-1" />
        <div className="flex justify-between mt-2">
          <div className="font-semibold">Innovation Scholarship</div>
          <div className="text-right">
            <p>Nankai University&nbsp;&nbsp;&nbsp;2023.10</p>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="font-semibold">
            Scholarship of Public Interests and All-Round Capability
          </div>
          <div className="text-right">
            <p>Nankai University&nbsp;&nbsp;&nbsp;2022.10</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mt-6">Competitions</h2>
        <hr className="mb-3 mt-1" />
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              2023 Compilation System Design Competition
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                Second Prize
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Leader, Guangzhou, 2023.5-2023.8</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">
              Computer System Development Capability Competition
            </p>
          </div>
          <div>
            <ul className="list-disc list-inside">
              <li>
                Developed a RISC-V targeted compiler for SysY programming
                language (a subset of C) with C++, Flex, and Bison.
              </li>
              <li>
                Constructed the framework and an LLVM-like intermediate
                representation for the compiler.
              </li>
              <li>
                Deigned and implemented the framework and added the core
                analysis and optimization passes.
              </li>
              <li>
                Utilized GitLab CI/CD to automatically test and evaluate the
                target performance.
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              2023 Operating System Design Competition
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                Honorable Mention
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Leader, Guangzhou, 2023.5-2023.8</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Functional Design Track</p>
            <p className="text-gray-500">
              Computer System Development Capability Competition
            </p>
          </div>
          <div>
            <ul className="list-disc list-inside">
              <li>
                Worked on adding support for LoongArch to the Tiny C Compiler
                (TCC).
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              Tianjin College Students’ Cybersecurity Competition
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                Third Prize
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Member, Tianjin, 2022.8</p>
            </div>
          </div>
          <div>
            <ul className="list-disc list-inside">
              <li>
                Solved reverse engineering and pwn challenges in the CTF
                competition.
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              2022 Compilation System Design Competition
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                Second Prize
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Member, Online, 2022.5-2022.8</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">
              Computer System Development Capability Competition
            </p>
          </div>
          <div>
            <ul className="list-disc list-inside">
              <li>
                Assisted in building a compiler targeting ARM architecture.
              </li>
              <li>
                Added support for floating-point feature and implemented
                peephole optimization.
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              2022 Operating System Design Competition
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                Honorable Mention
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Leader, Online, 2022.5-2022.8</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Functional Design Track</p>
            <p className="text-gray-500">
              Computer System Development Capability Competition
            </p>
          </div>
          <div>
            <ul className="list-disc list-inside">
              <li>Developed an automated compiler tuning tool in Python.</li>
              <li>
                Utilized statistical hypothesis testing, LinUCB, and Bayesian
                optimization algorithms.
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              National University Student Information Storage Technology
              Competition <a className="text-gray-400">(Massive Storage)</a>
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                Third Prize
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Member, Tianjin, 2022.10-2023.4</p>
            </div>
          </div>
          <div>
            <ul className="list-disc list-inside">
              <li>
                Assisted in developing of a long-term retention memory retrival
                system.
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              5th Peking University Engineering Hackathon{" "}
              <a className="text-gray-400">(HackPKU)</a>
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                Excellence Award
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Member, Online, 2022.5</p>
            </div>
          </div>
          <div>
            <ul className="list-disc list-inside">
              <li>Developed a game with RayLib and C in 36 hours.</li>
              <li>
                Constructed the framework and interface and assisted in
                implementing the map generation with Perlin noise.
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-5">
          <div className="flex justify-between mb-1">
            <div className="font-semibold w-1/2">
              Nankai University NFS Smart Vehicle Championship
            </div>
            <div className="text-center w-1/5">
              <a className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs">
                First Prize
              </a>
            </div>
            <div className="text-right w-1/3">
              <p>Team Member, Tianjin, 2022.5</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Junior Division</p>
          </div>

          <div>
            <ul className="list-disc list-inside">
              <li>Engineered an Arduino-based vehicle.</li>
              <li>
                Utilized infrared sensors and PID control algorithm to achieve
                the balance between speed and stability.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mt-6">Skills</h2>
        <hr className="mb-3 mt-1" />
        <div>
          <ul className="list-disc list-inside mt-4">
            <li>
              <a className="font-semibold">Languages:</a>&nbsp;Chinese (native),
              English (fluent, CET-6 619, TOEFL 103, GRE 327+3.5), Japanese (basic, CJT-4),
              German (basic)
            </li>
            <li>
              <a className="font-semibold">Programming Languages</a>
              <ul className="list-disc list-inside ml-6">
                <li>Proficient in Python</li>
                <li>Strong understanding of C++ and Rust</li>
                <li>Familiar with Mojo, Java, and TypeScript</li>
                <li>Basic knowledge of Haskell, Idris2 and Scala</li>
              </ul>
            </li>
            <li>
              Knowledge about LLVM and MLIR frameworks and compiler optimization
              techniques.
            </li>
            <li>
              Well-acquainted with architectures, ISAs and specifications such
              as ARM, RISC-V, and LoongArch.
            </li>
            <li>
              Understand the mechanism of language models like RNNs and
              Transformers, as well as vision models like CNNs and ViTs.
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mt-6">About This Site</h2>
        <hr className="mb-3 mt-1" />
        <div>
          <p>
            This is a very simple, basic blog and personal website built with
            Next.js and Tailwind CSS. I am not a professional in web
            development, but ChatGPT helped me a lot in building the structure
            and the frontend. I also have learned a lot while coding this site.
          </p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mt-6">Contact</h2>
        <hr className="mb-3 mt-1" />
        <ul className="list-disc list-inside mt-4">
          <li>
            Email:{" "}
            <a href="mailto:junimayerst@gmail.com" className="text-blue-500">
              junimayerst@gmail.com
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a
              href="https://www.linkedin.com/in/junyi-mei-35b524304/"
              className="text-blue-500"
            >
              Junyi (Juni) Mei
            </a>
          </li>
          <li>
            GitHub:{" "}
            <a href="https://github.com/JuniMay" className="text-blue-500">
              JuniMay
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
