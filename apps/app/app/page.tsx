"use client";

import Image, { type ImageProps } from "next/image";
import { Button, Flex, Typography } from "antd";

const { Text } = Typography;

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <Flex
      vertical
      align="center"
      justify="space-between"
      style={{ minHeight: "100vh", padding: "80px 32px 40px" }}
    >
      <Flex vertical align="center" gap={40}>
        <ThemeImage
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />

        <ol style={{ paddingLeft: 20 }}>
          <li>
            <Text>
              Get started by editing{" "}
              <Text code>apps/app/app/page.tsx</Text>
            </Text>
          </li>
          <li>
            <Text>Save and see your changes instantly.</Text>
          </li>
        </ol>

        <Flex gap={12} wrap>
          <Button
            type="primary"
            size="large"
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
            icon={
              <Image src="/vercel.svg" alt="Vercel logomark" width={16} height={16} />
            }
          >
            Deploy now
          </Button>
          <Button
            size="large"
            href="https://turborepo.dev/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </Button>
        </Flex>
      </Flex>

      <Flex gap={24} wrap justify="center" style={{ marginTop: 40 }}>
        <Button
          type="link"
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          icon={
            <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          }
        >
          Examples
        </Button>
        <Button
          type="link"
          href="https://turborepo.dev?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
          icon={
            <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          }
        >
          Go to turborepo.dev →
        </Button>
      </Flex>
    </Flex>
  );
}
